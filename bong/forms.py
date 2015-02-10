from django import forms
from django.contrib.auth.models import User
from bong.models import BongWallet


class CustomUserChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
         return obj.user


class WalletForm(forms.ModelForm):
    wallet = CustomUserChoiceField(queryset=BongWallet.objects.all())

    class Meta:
        model = BongWallet
        fields = '__all__'
