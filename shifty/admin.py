from django.contrib import admin
from shifty.models import Event, Shift, ShiftType

admin.site.register(Event)
admin.site.register(Shift)
admin.site.register(ShiftType)