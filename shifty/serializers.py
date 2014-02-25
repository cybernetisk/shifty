#from django.contrib.auth.models import User, Group
from models import Event, Shift, ShiftType, User
from rest_framework import serializers


class ShiftSerializer(serializers.ModelSerializer):
    duration = serializers.Field(source='duration');
    durationType = serializers.Field(source='durationType')

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType')
        depth = 1

class EventSerializer(serializers.ModelSerializer):
    shifts = ShiftSerializer(source='shifts')
    available = serializers.Field(source='availableShifts')

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start', 'shifts', 'available')
        depth = 1

class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = ('id', 'title', 'description')

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'contactinfo')
        depth = 1
