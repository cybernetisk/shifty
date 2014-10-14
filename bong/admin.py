from django.contrib import admin
from bong.forms import WalletForm
from bong.models import BongWallet, BongLog

class BongWalletAdmin(admin.ModelAdmin):
    actions = None
    search_fields = ['user__username']
    list_display = ('user', 'balance')

    readonly_fields = ('user', 'balance')


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
