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
        #instance.volunteer_id = user.id

        return instance

    class Meta:
        model = Shift
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType', 'end_report')
        depth = 1


class ShiftSerializer(serializers.ModelSerializer):
    duration = serializers.ReadOnlyField();
    durationType = serializers.ReadOnlyField()
    volunteer = LimitedUserSerializer()
    end_report = ShiftEndReportLightSerializer()
    #end_report = serializers.PrimaryKeyRelatedField(read_only=True)#ShiftEndReportLightSerializer()

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
        fields = ('id', 'event', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType', 'end_report', 'yourshift')
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

    end_report = serializers.SerializerMethodField('endReportField')
    def endReportField(self, obj):
        request = self.context.get('request', None)
        if request.user.is_staff:
            return ShiftEndReportLightSerializer(instance=obj.end_report).data
        return None

    #end_report = serializers.PrimaryKeyRelatedField(read_only=True)#ShiftEndReportLightSerializer()

    class Meta:
        model = Shift
        fields = ('id', 'shift_type', 'start', 'stop', 'volunteer', 'comment', 'duration', 'durationType', 'end_report', 'yourshift')
        depth = 1

class EventSerializer(serializers.ModelSerializer):
    shifts = EventShiftSerializer(many=True, read_only=True,)
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
