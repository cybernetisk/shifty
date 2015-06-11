#from django.contrib.auth.models import User, Group
from models import Event, Shift, ShiftType, User, ShiftEndReport
from rest_framework import serializers
from rest_framework import filters

from rest_framework_bulk import (
    BulkListSerializer,
    BulkSerializerMixin,
    ListBulkCreateUpdateDestroyAPIView,
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'first_name', 'last_name', 'contactinfo')
        depth = 1

class LimitedUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', )
        depth = 1

class ShiftEndReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftEndReport

class ShiftEndReportLightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftEndReport
        fields = ('id', 'verified', 'corrected_hours')


class ShiftTakeSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField();
    durationType = serializers.ReadOnlyField()
    volunteer = LimitedUserSerializer()
    end_report = ShiftEndReportLightSerializer() #serializers.PrimaryKeyRelatedField(read_only=True)#ShiftEndReportLightSerializer()

    def update(self, instance, validated_data):
        print self.intitial_data

        print validated_data
        if instance.volunteer != None:
            raise Exception("Shift allready taken")
        _id = validated_data['volunteer'].get('id')
        if _id is not None:
            user = User.objects.get(id=_id)
        else:
            username = validated_data['volunteer'].get('username')
            print "username=", username
            user = User.objects.filter(username=username)
            if user.count() != 1:
                raise Exception("No user found")
            user = user.one()
        instance.volunteer = user

        return instance

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType', 'end_report')
        depth = 1


class ShiftWriteSerializer(serializers.ModelSerializer):
    # def __init__(self, *args, **kwargs):
    #     many = kwargs.pop('many', True)
    #     super(ShiftWriteSerializer, self).__init__(many=many, *args, **kwargs)

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'comment', 'duration')

class ShiftSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField();
    durationType = serializers.ReadOnlyField()
    volunteer = LimitedUserSerializer()
    end_report = ShiftEndReportLightSerializer(required=False)

    can_change = serializers.SerializerMethodField('canChangeField')
    def canChangeField(self, obj):
        request = self.context.get('request', None)
        return obj.end_report.count() == 0

    volunteer = serializers.SerializerMethodField('volunteerField')
    def volunteerField(self, obj):
        request = self.context.get('request', None)
        if request.user.is_staff or (request.user is not None and request.user.id == obj.volunteer.id):
            return UserSerializer(instance=obj.volunteer).data
        return LimitedUserSerializer(instance=obj.volunteer).data

    yourshift = serializers.SerializerMethodField('yourshiftField')
    def yourshiftField(self, obj):
        request = self.context.get('request', None)
        if request is None:
            return False
        if obj.volunteer is None:
            return False
        return obj.volunteer.id == request.user.id

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType', 'end_report', 'yourshift', 'can_change')
        depth = 1

class EventShiftSerializer(ShiftSerializer):
    duration = serializers.ReadOnlyField();
    durationType = serializers.ReadOnlyField()
    volunteer = LimitedUserSerializer()

    volunteer = serializers.SerializerMethodField('volunteerField')
    def volunteerField(self, obj):
        if obj.volunteer is None:
            return None
        request = self.context.get('request', None)
        if request.user.is_staff:
            return UserSerializer(instance=obj.volunteer).data
        return LimitedUserSerializer(instance=obj.volunteer).data

    can_change = serializers.SerializerMethodField('canChangeField')
    def canChangeField(self, obj):
        request = self.context.get('request', None)
        return obj.end_report.count() == 0


    end_report = serializers.SerializerMethodField('endReportField')
    def endReportField(self, obj):
        request = self.context.get('request', None)
        if not request.user.is_staff:
            return None
        if obj.end_report.count() > 0:
            return ShiftEndReportLightSerializer(instance=obj.end_report.first()).data
        return None
    #end_report = serializers.PrimaryKeyRelatedField(read_only=True)#ShiftEndReportLightSerializer()

    class Meta:
        model = Shift
        fields = ('id', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType', 'end_report', 'yourshift', 'can_change')
        depth = 1

class EventSerializer(serializers.ModelSerializer):
    shifts = EventShiftSerializer(many=True, read_only=True,)
    #available = serializers.Field(source='availableShifts')
    responsible = UserSerializer(required=False)

    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start', 'responsible', 'shifts')#, 'available', 'next', 'previous')
        depth = 0


class EventNoShiftSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ('id', 'title', 'description', 'start', 'available')
        depth = 0


class ShiftTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftType
        fields = ('id', 'title', 'description', 'responsible')


class BulkShiftSerializer(BulkSerializerMixin, ShiftWriteSerializer):
    class Meta(object):
        model = Shift
        # only necessary in DRF3
        list_serializer_class = BulkListSerializer


# class BulkShiftView(ListBulkCreateUpdateDestroyAPIView):
#     queryset = Shift.objects.all()
#     serializer_class = BulkShiftSerializer