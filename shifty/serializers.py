#from django.contrib.auth.models import User, Group
from models import Event, Shift, ShiftType, User
from rest_framework import serializers
from rest_framework import filters

class LimitedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name', )
        depth = 1

class UserSerializer(serializers.ModelSerializer):
    def __init__(self, *args, **kwargs):
        super(UserSerializer, self).__init__(*args, **kwargs)
        self._limited_serializer = LimitedUserSerializer(*args, **kwargs)

    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'contactinfo')
        depth = 1

    def to_native(self, obj):#is_staff
        if self.context['request'].user.is_authenticated():
            if self.context['request'].user.is_staff or \
                    self.context['request'].user.id == obj.id:
                return super(UserSerializer, self).to_native(obj)
        return self._limited_serializer.to_native(obj)


class ShiftSerializer(serializers.ModelSerializer):
    duration = serializers.Field(source='duration');
    durationType = serializers.Field(source='durationType')
    volunteer = UserSerializer()

    def list(self, request, *args, **kwargs):
        res = super(ShiftSerializer, self).list(request, *args, **kwargs)
        print res
        return res


    def retrieve(self, request, *args, **kwargs):
        res = super(ShiftSerializer, self).retrieve(request, *args, **kwargs)
        print res
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

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start', 'shifts', 'available', 'next', 'previous')
        depth = 1

class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = ('id', 'title', 'description', 'responsible')
