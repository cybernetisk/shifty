from django.contrib import admin
from bong.forms import WalletForm
from bong.models import BongWallet, BongLog

class BongWalletAdmin(admin.ModelAdmin):
    actions = None
    search_fields = ['user__username']
    list_display = ('user', 'balance')

    def get_readonly_fields(self, request, obj=None):
        if obj: # obj is not None, so this is an edit
            return ['user', 'balance'] # Return a list or tuple of readonly fields' names
        else: # This is an addition
            return ['balance']


class BongLogAdmin(admin.ModelAdmin):
    actions = None
    list_display = ('getUsername', 'action', 'date', 'modify')

    def getUsername(self, obj):
        return obj.wallet.user

    getUsername.short_description = 'username'

    form = WalletForm
    fields = ('wallet', 'action', 'date', 'modify')

admin.site.register(BongWallet, BongWalletAdmin)
admin.site.register(BongLog, BongLogAdmin)
