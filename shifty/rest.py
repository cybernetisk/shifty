from django.contrib.auth.models import User, Group
from django.core.serializers import get_serializer
from rest_framework import viewsets, filters
from shifty.serializers import EventSerializer, ShiftSerializer, ShiftTypeSerializer, UserSerializer, \
    ShiftEndReportSerializer, ShiftTakeSerializer
from models import Event, Shift, ShiftType, User, ShiftEndReport

import django_filters
from django.core import serializers

from shifty.serializers import ShiftSerializer
from shifty.permissions import isAdminOrReadOnly
from rest_framework.mixins import CreateModelMixin
from rest_framework import generics
import datetime


from rest_framework.decorators import detail_route, list_route

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


class EventViewSet(viewsets.ModelViewSet):
    #permission_classes = (isAdminOrReadOnly, )

    queryset = Event.objects.all().order_by('start')
    serializer_class = EventSerializer
    #permission_classes = (isAdminOrReadOnly,)
    filter_class = EventFilter



class EventViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (isAdminOrReadOnly, )

    queryset = Event.objects.all().order_by('start')
    serializer_class = EventSerializer
    permission_classes = (isAdminOrReadOnly,)
    filter_class = EventFilter

class ShiftEndReportViewSet(viewsets.ModelViewSet):

    queryset = ShiftEndReport.objects.all()
    serializer_class = ShiftEndReportSerializer

    # FIXME: find a better way
    def get_serializer(self, *args, **kwargs):
        return ShiftEndReportSerializer(*args, many=True, **kwargs)


    def perform_create(self, serializer):
        serializer.save(signed=self.request.user)


class FreeShiftsViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (isAdminOrReadOnly, )

    queryset = Shift.objects.filter(volunteer__isnull=True)

    def get_serializer_class(self):
        if self.request.method in ['PATCH', 'POST', 'PUT']:
            return ShiftWriteSerializer
        return ShiftSerializer

    #permission_classes = (isAdminOrReadOnly,)
    filter_class = ShiftFilter

class ShiftViewSet(viewsets.ModelViewSet):
    permission_classes = (isAdminOrReadOnly, )

    queryset = Shift.objects.all()

    # FIXME: find a better way
    def get_serializer(self, *args, **kwargs):
        if self.request.user.is_staff:
            pass
        if self.request.method == 'PATCH':
            return ShiftTakeSerializer(*args, **kwargs)
        #print self.request.method == 'POST'
        return ShiftSerializer(*args, **kwargs)

    #permission_classes = (isAdminOrReadOnly,)
    filter_class = ShiftFilter


class ShiftTypeViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = (isAdminOrReadOnly, )

    queryset = ShiftType.objects.all()
    serializer_class = ShiftTypeSerializer


class YourShiftViewSet(viewsets.ReadOnlyModelViewSet):
    base_name = "lol"
    def get_queryset(self):
        user = self.request.user
        return user.shifts.all()
    serializer_class = ShiftSerializer

    """
    def get_queryset(self):
        user = self.request.user
        return Purchase.objects.filter(purchaser=user)
    """