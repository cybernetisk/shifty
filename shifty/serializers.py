#from django.contrib.auth.models import User, Group
from models import Event, Shift, ShiftType, User, ShiftEndReport
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
        fields = ('username', )
        depth = 1

    def to_native(self, obj):
        if self.context['request'].user.is_authenticated():
            print self.context['request'].user.id, obj.id
            if self.context['request'].user.is_staff or \
                    self.context['request'].user.id == obj.id:
                return self._full_serializer.to_native(obj)
        return super(LimitedUserSerializer, self).to_native(obj)

class ShiftEndReportSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShiftEndReport

class ShiftEndReportLightSerializer(serializers.ModelSerializer):

    class Meta:
        model = ShiftEndReport
        fields = ('id', 'verified', 'corrected_hours')


class ShiftSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField();
    durationType = serializers.ReadOnlyField()
    volunteer = LimitedUserSerializer()
    end_report = serializers.PrimaryKeyRelatedField(read_only=True)#ShiftEndReportLightSerializer()

    # def list(self, request, *args, **kwargs):
    #     res = super(ShiftSerializer, self).list(request, *args, **kwargs)
    #     return res


    # def retrieve(self, request, *args, **kwargs):
    #     res = super(ShiftSerializer, self).retrieve(request, *args, **kwargs)
    #     return res

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType', 'end_report')
        depth = 1

class ShiftWriteSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField(source='duration');
    durationType = serializers.ReadOnlyField(source='durationType')
    #volunteer = UserSerializer()

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType')
        depth = 0

class EventSerializer(serializers.ModelSerializer):
    shifts = ShiftSerializer(many=True, read_only=True)
    #available = serializers.Field(source='availableShifts')
    responsible = UserSerializer()

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start', 'responsible', 'shifts')#, 'available', 'next', 'previous')
        depth = 0

class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = ('id', 'title', 'description', 'responsible')
