from django.core.management.base import BaseCommand, CommandError
from shifty.models import *
import datetime


def create_event(day, navn, hour):
    start = day.replace(hour=hour, minute=0, second=0)
    e = Event(title=navn, start=start)
    e.save()
    return e

def addhours(x, a):
    return x + datetime.timedelta(hours=a)


def getshifttype(title):
    type = ShiftType.objects.filter(title=title).first()
    if type is None:
        type = ShiftType(title=title)
        type.save()
    return type


def make_shifts(event):
    barfunk = getshifttype(title='Barfunk')
    vaktfunk = getshifttype(title='Vaktfunk')
    start = event.start - datetime.timedelta(hours=1)

    skjenkemester = getshifttype(title="Skjenkemester")
    dj = getshifttype(title='DJ')
    s = Shift(event=event,
              shift_type=skjenkemester,
              start=start,
              stop=start + datetime.timedelta(hours=9))
    s.save()

    for i in [0,0,4, 4]:
        s = Shift(event=event,
                  start=addhours(start, i),
                  stop=addhours(start, i + 4),
                  shift_type=barfunk)
        s.save()
    start = event.start 
    for i in [0,4]:
        s = Shift(event=event,
                  start=addhours(start, i),
                  stop=addhours(start, i + 4),
                  shift_type=dj)
        s.save()


    start = event.start - datetime.timedelta(hours=1)
    for i in [0,0]:
        s = Shift(event=event,
                  start=addhours(start, i),
                  stop=addhours(start, i + 8),
                  shift_type=vaktfunk)
        s.save()

def create_events():
    k = datetime.datetime.now()
    start = k - datetime.timedelta(days=k.isoweekday()-10)
    for dag in ['mandag','tirsdag','onsdag','torsdag','fredag']:
        e = create_event(start, dag, 18)
        make_shifts(e)
        start += datetime.timedelta(days=1)


class Command(BaseCommand):
    help = 'Closes the specified poll for voting'

    def handle(self, *args, **options):
        create_events()