from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from shifty.serializers import EventSerializer, ShiftSerializer
from models import Event


class EventViewSet(viewsets.ModelViewSet):

    queryset = Event.objects.all()
    serializer_class = EventSerializer


"""class ViewSet(viewsets.ModelViewSet):
    
    API endpoint that allows groups to be viewed or edited.
    
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
"""