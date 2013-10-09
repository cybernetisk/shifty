from django.db import models
from django.contrib.auth.models import User
from django.core import serializers

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    start = models.DateTimeField()

    def __unicode__(self):
        return "%s (%s)" % (self.title, self.start.strftime("%d. %b %Y").lstrip("0").lower())

    def toDict(self):
        return {'title':self.title, 'description':self.description, 'start':str(self.start)}

    def getOrderedShifts(self):
        return self.shifts.all().order_by('shift_type')

    def getShiftColumns(self):
        columns = [[]]
        shifts = self.getOrderedShifts()

        column = 0
        index = 0
        twinCount = 0
        
        for i, shift in enumerate(shifts):      
            next = "Empty"
            if(i+1 < len(shifts)):
                next = shifts[i+1]

            if(next == "Empty" or not shift.isTwin(next)):
                if shift.durationType() == 'long':
                    columns[index].append({'shift':shift.toDict(), 'twins':twinCount+1, 'durationType':shift.durationType()})
                    column = 0
                elif shift.durationType()=='short':
                    columns[index].append({'shift':shift.toDict(), 'twins':twinCount+1, 'durationType':shift.durationType()})
                    column += 1

                if (next != 'Empty' and str(next) != str(shift)):
                    column = 0

                twinCount = 0
            else:
                twinCount += 1

            if(column == 0):
                columns.append([])
                index += 1

        return columns

class Shift(models.Model):
    event = models.ForeignKey("Event", null=False, related_name='shifts')
    shift_type = models.ForeignKey("ShiftType", null=False, related_name='+')
    volunteer = models.ForeignKey(User, null=True, blank=True)
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
        return int(dt.seconds/60/60)

    def toDict(self):
        return {'type':str(self).lower(), 'start':str(self.start), 'stop':str(self.stop)}

class ShiftType(models.Model):
    title = models.CharField(max_length=30)
    description = models.TextField(blank=True)

    def __unicode__(self):
        return self.title