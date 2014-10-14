from django.db import models, transaction
from django.contrib.auth.models import User
from shifty.models import Shift

class BongWallet(models.Model):
    user = models.ForeignKey(User)
    balance = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        return #no deleting of bong wallets!

class BongLog(models.Model):
    BONG_ACTION_CHOICES = (
        ('0', 'assigned'),
        ('1', 'claimed'),
        ('2', 'revoked')
    )

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if self.id is None:
                super(BongLog, self).save(*args, **kwargs)
                self.wallet.balance += self.modify
                self.wallet.save()

    def delete(self, *args, **kwargs):
        return #no deleting of logs!

    wallet = models.ForeignKey(BongWallet)
    action = models.CharField(max_length=1, choices=BONG_ACTION_CHOICES, default='0')
    shift = models.OneToOneField(Shift, null=True)
    date = models.DateTimeField()
    modify = models.IntegerField(default=0)
