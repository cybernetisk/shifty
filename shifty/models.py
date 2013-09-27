from django.db import models
from django.contrib.auth.models import User

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start = models.DateTimeField()

    def __unicode__(self):
        return "%s (%s)" % (self.title, self.start.strftime("%d. %b %Y").lstrip("0").lower())

    def getOrderedShifts(self):
        return self.shift_set.all().order_by('shift_type')

class Shift(models.Model):
    event = models.ForeignKey("Event", null=False, related_name='shifts')
    shift_type = models.ForeignKey("ShiftType", null=False, related_name='+')
    volunteer = models.ForeignKey(User, null=True, blank=True)
    start = models.DateTimeField()
    stop = models.DateTimeField()
    
    def __unicode__(self):
        return self.shift_type.title


    def getIsTwin(self, shift):
        if self.start == shift.start:
            return True
        else:
            return False


class ShiftType(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.title