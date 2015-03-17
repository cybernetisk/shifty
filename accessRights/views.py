from django.shortcuts import render
from rest_framework import viewsets
from accessRights.models import AccessRights, InternCards
from accessRights.serializers import PermissionSerializer, InternCardsSerializer


def show_permissions(request):
    access_model = AccessRights.objects.all()
    card_model = InternCards.objects.all()

    context = {
        'intern_cards': card_model,
        'access_data': access_model
    }

    return render(request, 'accessRights/permissions.html', context)


class AccessRightsViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows to view AccessRights
    """
    queryset = AccessRights.objects.all()
    serializer_class =  PermissionSerializer


class InternCardsViewSet(viewsets.ModelViewSet):
    queryset = InternCards.objects.all()
    serializer_class = InternCardsSerializer