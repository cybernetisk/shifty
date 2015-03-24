from django.contrib.auth.models import User, Group
from rest_framework import viewsets, filters
from shifty.serializers import EventSerializer, ShiftSerializer, ShiftWriteSerializer, ShiftTypeSerializer, UserSerializer
from models import Event, Shift, ShiftType, User

import django_filters
from django.core import serializers

from shifty.serializers import ShiftSerializer
from shifty.permissions import isAdminOrReadOnly
from rest_framework.mixins import CreateModelMixin
import datetime


class RelativeDateFilter(django_filters.CharFilter):
    def filter(self, qs, value):
        res = None
        if value == 'today':
            res = datetime.date.today()
        elif value:
            res = datetime.datetime.strptime(value, "%Y-%m-%d")
        if res is not None:
            return django_filters.CharFilter.filter(self, qs, res)
        return qs


class EventFilter(django_filters.FilterSet):
    min_date = RelativeDateFilter(name="start", lookup_type='gte')
    class Meta:
        model = Event
        fields = ['min_date']

class ShiftFilter(django_filters.FilterSet):
    min_date = RelativeDateFilter(name="start", lookup_type='gte')
    max_date = RelativeDateFilter(name="start", lookup_type='lte')
    shift_type = django_filters.NumberFilter(name="shift_type")
    class Meta:
        model = Shift
        fields = ['min_date', 'max_date', 'shift_type', 'volunteer']


class EventViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (isAdminOrReadOnly, )

    queryset = Event.objects.all().order_by('start')
    serializer_class = EventSerializer
    permission_classes = (isAdminOrReadOnly,)
    filter_class = EventFilter


class FreeShiftsViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (isAdminOrReadOnly, )

    queryset = Shift.objects.filter(volunteer__isnull=True)

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'POST', 'PUT']:
            return ShiftWriteSerializer
        return ShiftSerializer

    #permission_classes = (isAdminOrReadOnly,)
    filter_class = ShiftFilter

class ShiftViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (isAdminOrReadOnly, )

    queryset = Shift.objects.all()

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'POST', 'PUT']:
            return ShiftWriteSerializer
        return ShiftSerializer
    #permission_classes = (isAdminOrReadOnly,)
    filter_class = ShiftFilter


class ShiftTypeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (isAdminOrReadOnly, )

    queryset = ShiftType.objects.all()
    serializer_class = ShiftTypeSerializer
