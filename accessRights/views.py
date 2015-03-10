from django.shortcuts import render
from accessRights.models import AccessRights, InternCards


def show_permissions(request):
    access_model = AccessRights.objects.all()
    card_model = InternCards.objects.all()

    context = {
        'intern_cards': card_model,
        'access_data': access_model
    }

    return render(request, 'accessRights/test.html', context)
