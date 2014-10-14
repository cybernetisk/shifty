from django.db import models, transaction
from django.contrib.auth.models import User
from shifty.models import Shift

# @transaction.atomic
class BongWallet(models.Model):
    user = models.ForeignKey(User)
    balance = models.IntegerField(default=0)


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

    wallet = models.ForeignKey(BongWallet)
    action = models.CharField(max_length=1, choices=BONG_ACTION_CHOICES, default='0')
    shift = models.OneToOneField(Shift, null=True)
    date = models.DateTimeField()
    modify = models.IntegerField(default=0)
