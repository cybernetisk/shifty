from django.contrib import admin
from bong.forms import WalletForm
from bong.models import BongWallet, BongLog

class BongWalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')
    search_fields = ['user__username']

    actions = None

class BongLogAdmin(admin.ModelAdmin):
    list_display = ('getUsername', 'action', 'date', 'modify')

    def getUsername(self, obj):
        return obj.wallet.user

    getUsername.short_description = 'username'

    form = WalletForm
    fields = ('wallet', 'action', 'date', 'modify')
    actions = None

admin.site.register(BongWallet, BongWalletAdmin)
admin.site.register(BongLog, BongLogAdmin)
