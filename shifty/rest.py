from django.contrib.auth.models import User, Group
from rest_framework import viewsets, filters
from shifty.serializers import EventSerializer, ShiftSerializer, ShiftTypeSerializer, UserSerializer
from models import Event, Shift, ShiftType, User

import django_filters
from django.core import serializers

from shifty.serializers import ShiftSerializer
from shifty.permissions import isAdminOrReadOnly
from rest_framework.mixins import CreateModelMixin
import datetime


class RelativeDateFilter(django_filters.DateFilter):
    def filter(self, qs, value):
        if 'value' == 'today':
            value = datetime.datetime.today().strftime("%Y-%m-%d")
        return django_filters.DateFilter.filter(self, qs, value)


class EventFilter(django_filters.FilterSet):
    min_date = RelativeDateFilter(name="start", lookup_type='gte')
    class Meta:
        model = Event
        fields = ['min_date']


class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all().order_by('start')
    serializer_class = EventSerializer
    permission_classes = (isAdminOrReadOnly,)
    filter_class = EventFilter

    """
    Create a model instance.
    """
    def create(self, request, *args, **kwargs):
        if isinstance(request.DATA, dict) and len(request.DATA['shifts']) > 0:
            shifts = request.DATA['shifts']
            request.DATA['shifts'] = []
            response = CreateModelMixin.create(self, request, *args, **kwargs)

            result = response.data
            event_id = result['id']
            serializer = ShiftSerializer()
            exceptions = {}
            for i, _shift in enumerate(shifts):
                try:
                    if 'shift_type' in _shift:
                        _shift['shift_type_id'] = _shift['shift_type']['id']
                        del _shift['shift_type']
                    _s = Shift(event_id=event_id, **_shift).save()
                    json = serializer.to_native(_s)
                    result['shifts'].append(json)
                except Exception as ex:
                    exceptions[i] = str(ex)
            result['errors'] = exceptions
            return response

        return CreateModelMixin.create(self, request, *args, **kwargs)

class ShiftViewSet(viewsets.ModelViewSet):

    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer
    permission_classes = (isAdminOrReadOnly,)

    filter_fields = ('shift_type', )

class ShiftTypeViewSet(viewsets.ModelViewSet):

    queryset = ShiftType.objects.all()
    serializer_class = ShiftTypeSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter,)
    search_fields = ('username', 'first_name', 'last_name')


"""class ViewSet(viewsets.ModelViewSet):
    
    API endpoint that allows groups to be viewed or edited.
    
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
"""