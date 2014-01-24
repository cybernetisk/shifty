#from django.contrib.auth.models import User, Group
from models import Event, Shift, ShiftType
from rest_framework import serializers


class ShiftSerializer(serializers.ModelSerializer):
    volunteer2 = serializers.Field(source='volunteer2')
    duration = serializers.Field(source='_duration')
    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'volunteer2', 'duration')

class EventSerializer(serializers.ModelSerializer):
    shifts = ShiftSerializer(source='shifts')
    
    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start', 'shifts')
        depth = 1

class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = ('id', 'title', 'description')
