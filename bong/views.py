from bong.models import BongWallet
from rest_framework import viewsets
from bong.serializers import WalletSerializer


class WalletViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Wallets to be viewed or edited.
    """
    queryset = BongWallet.objects.all()
    serializer_class = WalletSerializer