#from django.contrib.auth.models import User, Group
from models import Event, Shift, ShiftType
from rest_framework import serializers


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start', 'shifts')


class ShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment')


class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = ('id', 'title', 'description')
