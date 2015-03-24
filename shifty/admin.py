from django.contrib import admin
from shifty.models import Event, Shift, ShiftType, ContactInfo, ShiftEndReport  #, ShiftEndReport
from shifty.models import UserShiftQualification
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from django.http import HttpResponseRedirect
import reversion

from django import forms

from django.db import models

import autocomplete_light



class UserAutocomplete(autocomplete_light.AutocompleteModelBase):
    search_fields = ['^first_name', 'last_name', 'username']

    def choices_for_request(self):
        if not self.request.user.is_staff:
            return []
        return super(UserAutocomplete, self).choices_for_request()

autocomplete_light.register(User, UserAutocomplete)


class ShiftInLine(admin.TabularInline):
    extra = 0
    formfield_overrides = {
        models.TextField: {'widget': forms.Textarea(attrs={'rows':3, 'cols':40})},
    }
    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == 'volunteer':
            kwargs['widget'] = autocomplete_light.ChoiceWidget('UserAutocomplete')
        return super(ShiftInLine,self).formfield_for_dbfield(db_field,**kwargs)

    model = Shift

class EventInLine(admin.TabularInline):
    model = Event
    extra = 0


def make_copy(modeladmin, request, queryset):
    selected = request.POST.getlist(admin.ACTION_CHECKBOX_NAME)
    #ct = ContentType.objects.get_for_model(queryset.model)
    return HttpResponseRedirect("/copy_events/?ids=%s" % ",".join(selected))
    #queryset.update(status='p')
make_copy.short_description = "Copy selected events"


# class ShiftEndReportInLine(admin.TabularInline):
#     model = ShiftEndReport
#     extra = 0


# class EventClose(reversion.VersionAdmin):
#     inlines = [ShiftEndReportInLine]


class EventAdmin(reversion.VersionAdmin):
    inlines = [ShiftInLine]
    list_display = ('title', 'start', 'availableShifts', 'totalShifts', 'responsible')
    actions = [make_copy]

    class Media:
        js = (
           # '//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js', # jquery
            '/static/js/admin_hack.js',
        )

class ShiftEndReportAdmin(reversion.VersionAdmin):
    pass


class ShiftAdmin(reversion.VersionAdmin):
    list_display = ('shift_type', 'event', 'start')

class ContactInline(admin.StackedInline):
    model = ContactInfo
    can_delete = False
    verbose_name_plural = 'contact infos'

class ShiftQualificationInline(admin.StackedInline):
    model = UserShiftQualification
    verbose_name_plural = 'user shift qualifications'

# Define a new User admin
class UserAdmin(UserAdmin):
    inlines = (ContactInline, ShiftQualificationInline)

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

#admin.site.register(Event, EventAdmin)
admin.site.register(ShiftType, reversion.VersionAdmin)
admin.site.register(Shift, ShiftAdmin)
admin.site.register(ShiftEndReport, ShiftEndReportAdmin)

#admin.site.register(Event, EventClose)
