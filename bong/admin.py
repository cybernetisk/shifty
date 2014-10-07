from django.contrib import admin
from bong.models import BongWallet, BongLog

class BongWalletAdmin(admin.ModelAdmin):
    list_display = ('user', 'balance')
    search_fields = ['=user__username', ]
    actions = None

class BongLogAdmin(admin.ModelAdmin):
    list_display = ('user', 'action', 'date', 'modify')
    actions = None

admin.site.register(BongWallet, BongWalletAdmin)
admin.site.register(BongLog, BongLogAdmin)
