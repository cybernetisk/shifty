from django.contrib import admin
from shifty.models import Event, Shift, ShiftType, ContactInfo
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.http import HttpResponseRedirect
import reversion

from django import forms

from django.db import models

class ShiftInLine(admin.TabularInline):
    model = Shift
    extra = 0
    formfield_overrides = {
        models.TextField: {'widget': forms.Textarea(attrs={'rows':3, 'cols':40})},
    }


class EventInLine(admin.TabularInline):
    model = Event
    extra = 0


def make_copy(modeladmin, request, queryset):
    selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
    #ct = ContentType.objects.get_for_model(queryset.model)
    return HttpResponseRedirect("/copy_events/?ids=%s" % ",".join(selected))
    #queryset.update(status='p')
make_copy.short_description = "Copy selected events"




class EventAdmin(reversion.VersionAdmin):
    inlines = [ShiftInLine]

    list_display = ('title', 'start', )

    actions = [make_copy]

    class Media:
        js = (
            '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', # jquery
            '/static/js/admin_hack.js'
        )

class ShiftAdmin(reversion.VersionAdmin):
    list_display = ('shift_type', 'event', 'start')

class ContactInline(admin.StackedInline):
    model = ContactInfo
    can_delete = False
    verbose_name_plural = 'contact infos'

# Define a new User admin
class UserAdmin(UserAdmin):
    inlines = (ContactInline, )

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

admin.site.register(Event, EventAdmin)
admin.site.register(ShiftType, reversion.VersionAdmin)
admin.site.register(Shift, ShiftAdmin)