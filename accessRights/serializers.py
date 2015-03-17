from django.contrib.auth.models import User, Group
from rest_framework import serializers
from accessRights.models import AccessRights, InternCards
from shifty.serializers import UserSerializer

class PermissionSerializer(serializers.ModelSerializer):
    user  = UserSerializer()
    class Meta:
        model = AccessRights
        fields = ('user', 'group', 'aktiv_level', 'operational_level',
                  'forening_level', 'have_access')
        depth = 1



class InternCardsSerializer(serializers.ModelSerializer):
    user  = UserSerializer()
    given_by = UserSerializer()
    class Meta:
        model = InternCards
        fields = ('user', 'card_number', 'group', 'given_by', 'date_given')
        depth = 1