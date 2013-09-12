from django.contrib import admin
from shifty.models import Event, Shift, ShiftType

class ShiftInLine(admin.TabularInline):
    model = Shift
    extra = 0

class EventAdmin(admin.ModelAdmin):
    inlines = [ShiftInLine]

admin.site.register(Event, EventAdmin)
admin.site.register(ShiftType)