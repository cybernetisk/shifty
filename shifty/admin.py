from django.contrib import admin
from shifty.models import Event, Shift, ShiftType, ContactInfo
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin

class ShiftInLine(admin.TabularInline):
    model = Shift
    extra = 0

class EventAdmin(admin.ModelAdmin):
    inlines = [ShiftInLine]


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
admin.site.register(ShiftType)
admin.site.register(Shift)