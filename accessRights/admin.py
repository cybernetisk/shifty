from django.contrib import admin

# Register your models here.
from accessRights.models import AccessRights, InternCards


class AccessAdmin(admin.ModelAdmin):
    list_display = ('user', 'group', 'aktiv_level', 'operational_level', 'forening_level', 'have_access')
    search_fields = ['user__username']

    actions = None

class InernCardsAdmin(admin.ModelAdmin):
    list_display = ('user', 'card_number',  'group', 'given_by','date_given')
    search_fields = ['user__username']





admin.site.register(AccessRights,AccessAdmin)
admin.site.register(InternCards, InernCardsAdmin)