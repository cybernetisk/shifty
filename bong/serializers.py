from django.contrib.auth.models import User, Group
from rest_framework import serializers
from bong.models import BongWallet


class WalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = BongWallet
        fields = ('user', 'balance')
        depth = 1