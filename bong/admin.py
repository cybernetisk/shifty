from django.contrib import admin
from bong.models import BongWallet, BongLog

class BongWalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')

class BongLogAdmin(admin.ModelAdmin):
    fields = ('user', 'action', 'date', 'modify')

admin.site.register(BongWallet, BongWalletAdmin)
admin.site.register(BongLog, BongLogAdmin)
