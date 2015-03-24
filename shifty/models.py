from django.db import models
from django.contrib.auth.models import User
from django.core import serializers
from django.template.defaultfilters import date as _date
from django.core.exceptions import ValidationError
from django.db.models import Q
import datetime
import reversion
from django.db import transaction
from colorful.fields import RGBColorField
from django.utils import timezone
from midnight import midnight, day
import colorsys

class WeekdayChangedException(Exception):
    def __init__(self, events):
        self.events = events
        Exception.__init__(self, "Day of week changed!")


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start = models.DateTimeField()

    @property
    def responsible(self):
        for shift in self.shifts.all():
            if shift.shift_type.responsible:
                return shift.volunteer

    @property
    def week(self):
        return self.start.strftime("%V")

    @property
    def finished(self):
        return self.start.date() < datetime.date.today()

    @property
    def next(self):
        res = Event.objects.filter(Q(start__gt=self.start) |
                                   Q(start=self.start, id__gt=self.id)) \
                           .order_by('start', 'id')[:1]
        if res.count() == 0:
            return None
        return {'title':res[0].title, 'id':res[0].id}

    @property
    def previous(self):
        res = Event.objects.filter(Q(start__lt=self.start) |
                                   Q(start=self.start, id__lt=self.id)) \
                           .order_by('-start', '-id')[:1]
        if res.count() == 0:
            return None
        return {'title':res[0].title, 'id':res[0].id}

    def __unicode__(self):
        return "%s (%s)" % (self.title, self.start.strftime("%d. %b %Y %H").lstrip("0").lower())

    def toDict(self):
        return {'title':self.title, 'description':self.description, 'start':_date(self.start, "l j. F Y").capitalize()}

    def availableShifts(self):
        return self.shifts.filter(volunteer__isnull = True).count()

    def totalShifts(self):
        return self.shifts.count()

    def get_offset(self, date):
        return date - self.start.date()

    def copy(self, date=None, offset=None):
        if date is not None:
            offset = self.get_offset(date)

        event_copy = {'start':None, 'title':None, 'description':None}
        for k in event_copy.keys():
            event_copy[k] = getattr(self, k)
        event_copy['start'] += offset
        event = Event(**event_copy)
        event.save()
        for shift in self.shifts.all():
            shift_copy = {'shift_type_id':None, 'start':None, 'stop':None, 'comment':None}
            for k in shift_copy.keys():
                shift_copy[k] = getattr(shift, k)
            shift_copy['start'] += offset
            shift_copy['stop'] += offset
            shift_copy['event'] = event
            new_shift = Shift(**shift_copy).save()
        return event

    @classmethod
    def get_max_offset(cls, events, date):
        offset = None
        for event in events:
            tmp_offset = event.get_offset(date)
            if offset is None or tmp_offset > offset:
                offset = tmp_offset
        return offset

    @classmethod
    def check_same_day(cls, events, date):
        offset = Event.get_max_offset(events, date)
        failed = []
        for event in events:
            now = event.start.date()
            after_offset = now + offset
            if now.weekday() != after_offset.weekday():
                print now, after_offset
                failed.append(event)
        if failed:
            raise WeekdayChangedException(failed)

    @classmethod
    def copy_events(cls, events, date):
        offset = Event.get_max_offset(events, date)
        copies = []
        for event in events:
            with transaction.atomic(), reversion.create_revision():
                copies.append(event.copy(offset=offset))
                reversion.set_comment("Copied event from %r" % event)
        return copies
reversion.register(Event, follow=["shifts"])


class ShiftEndReport(models.Model):
    shift = models.ForeignKey("Shift", null=False, related_name="end_report")
    event = models.ForeignKey("Event", null=False, related_name='end_reports')
    verified = models.BooleanField()
    signed = models.ForeignKey(User, null=True, blank=True)
    corrected_hours = models.DecimalField(max_digits=3, decimal_places=1, null=True)
    bong_ref = models.IntegerField(null=True)


class Shift(models.Model):
    event = models.ForeignKey("Event", null=False, related_name='shifts')
    shift_type = models.ForeignKey("ShiftType", null=False, related_name='+')
    volunteer = models.ForeignKey(User, null=True, blank=True, related_name='shifts')
    comment = models.TextField(blank=True)
    start = models.DateTimeField()
    stop = models.DateTimeField()

    #new = models.BooleanField

    def __unicode__(self):
        return self.shift_type.title

    def isTwin(self, shift):
        if (self.shift_type == shift.shift_type) and (self.start == shift.start) and (self.stop == shift.stop):
            return True
        else:
            return False

    def durationType(self):
        if self.duration() > 5:
            return 'long'
        else:
            return 'short'

    def user_collides(self, user):
        _start = midnight(self.start)
        _stop = _start + day
        shifts = user.shifts.filter(Q(start__range=(_start, _stop)) | Q(stop__range=(_start, _stop)))
        for shift in shifts:
            if self != shift and shift.collides(self):
                return shift
        return None

    def clean(self):
        if self.volunteer is not None:
            collision = self.user_collides(self.volunteer)
            if collision is not None:
                raise ValidationError('Collides with another shift (%s)' % collision.day_desc())

    def collides(self, shift):
        if self.start <= shift.start < self.stop:
            return True
        if self.start < shift.stop <= self.stop:
            return True
        if shift.start <= self.start < shift.stop:
            return True
        return False

    # Returns shift duration in hours
    def duration(self):
        dt = self.stop - self.start
        return round(dt.seconds / 3600.0, 1)

    def save(self, *args, **kwargs):
        if self.stop < self.start:
            self.stop += datetime.timedelta(days=1)
        return models.Model.save(self, *args, **kwargs)

    def can_remove_user(self):
        return False

    def toDict(self):
        return {'id': self.id,
                'type':str(self),
                'durationType':self.durationType(),
                'start':_date(self.start, "H:i"),
                'stop':_date(self.stop, "H:i"),
                'cssClass':'shift_type_' + self.id}

    def day_desc(self):
        return "%s %s-%s" % (self.shift_type.title, self.start.strftime("%H"), self.stop.strftime("%H"))

reversion.register(Shift)


def parse_html_color(color):
    if not color:
        return 0, 0, 0
    return int(color[1:3], 16), int(color[3:5], 16), int(color[5:7], 16)

def html_color(r, g, b):
    if r < 0:
        r = 0
    if g < 0:
        g = 0
    if b < 0:
        b = 0
    if r > 255:
        r = 255
    if g > 255:
        g = 255
    if b > 255:
        b = 255
    return "#%02x%02x%02x" % (r, g, b)

class ShiftType(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(blank=True)
    responsible = models.BooleanField(default=False)
    color = RGBColorField()

    @property
    def background_color(self):
        return self.color

    @property
    def border_color(self):
        r, g, b = parse_html_color(str(self.color))
        return html_color(r - 20, g - 20, b - 20)

    @property
    def taken_color(self):
        r, g, b = map(lambda x: float(x) / 255, parse_html_color(str(self.color)))
        h,s,v = colorsys.rgb_to_hsv(r,g,b)
        print h,s,v
        s = max(0, s - 0.5)
        v = min(1, v - 0.1)
        r, g, b = map(lambda x: int(x * 255), colorsys.hsv_to_rgb(h, s, v))
        return html_color(r,g,b)

    @property
    def yourshift_color(self):
        r, g, b = parse_html_color(str(self.color))
        return html_color(r + 80, g + 80, b + 80)


    def __unicode__(self):
        return self.title
reversion.register(ShiftType)

class ContactInfo(models.Model):
    user = models.OneToOneField(User)
    phone = models.CharField(max_length=100)
reversion.register(ContactInfo)

class UserShiftQualification(models.Model):
    user = models.OneToOneField(User)
    shifType = models.ManyToManyField(ShiftType)
