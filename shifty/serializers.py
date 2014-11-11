#from django.contrib.auth.models import User, Group
from models import Event, Shift, ShiftType, User
from rest_framework import serializers
from rest_framework import filters

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'contactinfo')
        depth = 1

class LimitedUserSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(LimitedUserSerializer, self).__init__(*args, **kwargs)
        self._full_serializer = UserSerializer(*args, **kwargs)

    class Meta:
        model = User
        fields = ('first_name', )
        depth = 1

    def to_native(self, obj):
        if self.context['request'].user.is_authenticated():
            if self.context['request'].user.is_staff or \
                    self.context['request'].user.id == obj.id:
                return self._full_serializer.to_native(obj)
        return super(LimitedUserSerializer, self).to_native(obj)



class ShiftSerializer(serializers.ModelSerializer):
    duration = serializers.Field(source='duration');
    durationType = serializers.Field(source='durationType')
    volunteer = LimitedUserSerializer()

    def list(self, request, *args, **kwargs):
        res = super(ShiftSerializer, self).list(request, *args, **kwargs)
        return res


    def retrieve(self, request, *args, **kwargs):
        res = super(ShiftSerializer, self).retrieve(request, *args, **kwargs)
        return res

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType')
        depth = 1

class ShiftWriteSerializer(serializers.ModelSerializer):
    duration = serializers.Field(source='duration');
    durationType = serializers.Field(source='durationType')
    #volunteer = UserSerializer()

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType')
        depth = 0

class EventSerializer(serializers.ModelSerializer):
    shifts = ShiftSerializer(source='shifts')
    available = serializers.Field(source='availableShifts')
    previous = serializers.Field(source='previous')
    next = serializers.Field(source='next')
    responsible = UserSerializer(source='responsible')

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start', 'responsible', 'shifts', 'available', 'next', 'previous')
        depth = 1

class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = ('id', 'title', 'description', 'responsible')
