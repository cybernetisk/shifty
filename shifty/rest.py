from django.contrib.auth.models import User, Group
from rest_framework import viewsets, filters
from shifty.serializers import EventSerializer, ShiftSerializer, ShiftTypeSerializer, UserSerializer
from models import Event, Shift, ShiftType, User


class EventViewSet(viewsets.ModelViewSet):

    queryset = Event.objects.all()
    serializer_class = EventSerializer



class ShiftViewSet(viewsets.ModelViewSet):

    queryset = Shift.objects.all()
    serializer_class = ShiftSerializer



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