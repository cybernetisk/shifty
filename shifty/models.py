from django.db import models
from django.contrib.auth.models import User
from django.core import serializers
from django.template.defaultfilters import date as _date
from django.db.models import Q
import datetime
import reversion
from django.db import transaction


class WeekdayChangedException(Exception):
    def __init__(self, events):
        self.events = events
        Exception.__init__(self, "Day of week changed!")


class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start = models.DateTimeField()

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
    def get_min_offset(cls, events, date):
        offset = None
        for event in events:
            tmp_offset = event.get_offset(date)
            if offset is None or tmp_offset < offset:
                offset = tmp_offset
        return offset

    @classmethod
    def check_same_day(cls, events, date):
        offset = Event.get_min_offset(events, date)
        failed = []
        for event in events:
            now = event.start.date()
            after_offset = now + offset
            if now.weekday() != after_offset.weekday():
                failed.append(event)
        if failed:
            raise WeekdayChangedException(failed)

    @classmethod
    def copy_events(cls, events, date):
        offset = Event.get_min_offset(events, date)
        copies = []
        for event in events:
            with transaction.atomic(), reversion.create_revision():
                copies.append(event.copy(offset=offset))
                reversion.set_comment("Copied event from %r" % event)
        return copies
reversion.register(Event)

class Shift(models.Model):
    event = models.ForeignKey("Event", null=False, related_name='shifts')
    shift_type = models.ForeignKey("ShiftType", null=False, related_name='+')
    volunteer = models.ForeignKey(User, null=True, blank=True)
    comment = models.TextField(blank=True)
    start = models.DateTimeField()
    stop = models.DateTimeField()

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

    # Returns shift duration in hours
    def duration(self):
        dt = self.stop - self.start
        return round(dt.seconds / 3600.0, 1)

    def can_remove_user(self):
        return False

    def toDict(self):
        return {'id': self.id,
                'type':str(self),
                'durationType':self.durationType(), 
                'start':_date(self.start, "H:i"), 
                'stop':_date(self.stop, "H:i"),
                'cssClass':str(self).lower()}
reversion.register(Shift)

class ShiftType(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.title
reversion.register(ShiftType)

class ContactInfo(models.Model):
    user = models.OneToOneField(User)
    phone = models.CharField(max_length=100)
reversion.register(ContactInfo)