from django.contrib.auth.models import User, Group
from rest_framework import serializers
from bong.models import BongWallet
from shifty.serializers import UserSerializer

class WalletSerializer(serializers.ModelSerializer):
    user  = UserSerializer()
    class Meta:
        model = BongWallet
        fields = ('user', 'balance')
        depth = 1
