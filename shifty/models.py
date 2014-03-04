from django.db import models
from django.contrib.auth.models import User
from django.core import serializers
from django.template.defaultfilters import date as _date

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start = models.DateTimeField()

    @property
    def next(self):
        print Event.objects.filter(start__gt=self.start).exclude(id=self.id)
        res = Event.objects.filter(start__gt=self.start).order_by('start', 'id').exclude(id=self.id)[:1]
        if res.count() == 0:
            return None
        return {'title':res[0].title, 'id':res[0].id}

    @property
    def previous(self):
        res = Event.objects.filter(start__lte=self.start).order_by('-start', '-id').exclude(id=self.id)[:1]
        if res.count() == 0:
            return None
        return {'title':res[0].title, 'id':res[0].id}

    def __unicode__(self):
        return "%s (%s)" % (self.title, self.start.strftime("%d. %b %Y").lstrip("0").lower())

    def toDict(self):
        return {'title':self.title, 'description':self.description, 'start':_date(self.start, "l j. F Y").capitalize()}

    def availableShifts(self):
        return self.shifts.filter(volunteer__isnull = True).count()

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

class ShiftType(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.title

class ContactInfo(models.Model):
    user = models.OneToOneField(User)
    phone_number = models.CharField(max_length=100)