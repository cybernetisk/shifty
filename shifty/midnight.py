import datetime

_midnight = datetime.time(0)
def midnight(dt):
    return datetime.datetime.combine(dt.date(), _midnight)

_noon = datetime.time(12)
def noon(dt):
    return datetime.datetime.combine(dt.date(), _noon)

day = datetime.timedelta(days=1)
hour = datetime.timedelta(hours=1)
