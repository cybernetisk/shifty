from django.contrib import admin
from bong.models import BongWallet, BongLog

class BongWalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')
    search_fields = ['user__username']
    actions = None

class BongLogAdmin(admin.ModelAdmin):
    list_display = ('username', 'action', 'date', 'modify')
    actions = None

    def username(self, obj):
        return obj.wallet.user

admin.site.register(BongWallet, BongWalletAdmin)
admin.site.register(BongLog, BongLogAdmin)
