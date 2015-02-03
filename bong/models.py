from django.db import models, transaction
from django.contrib.auth.models import User
from datetime import datetime
from shifty.models import Shift

class BongWallet(models.Model):
    user = models.ForeignKey(User)
    balance = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        return # no deleting of bong wallets!

    def calcBalance(self):
        self.balance = 0

        logs = BongLog.objects.filter(wallet__exact=self)
        for log in logs:
            self.balance += log.getModifier()

        return self.balance

    def save(self, *args, **kwargs):
        with transaction.atomic():
            # disable modifying wallets directly
            if self.id is None:
                super(BongWallet, self).save(*args, **kwargs)

class BongLog(models.Model):
    ASSIGNED = '0';
    CLAIMED = '1';
    REVOKED = '2';

    BONG_ACTION_CHOICES = (
        (ASSIGNED, 'assigned'),
        (CLAIMED, 'claimed'),
        (REVOKED, 'revoked')
    )

    def save(self, *args, **kwargs):
        with transaction.atomic():
            self.modify = abs(self.modify)

            # disable modifying logs
            if self.id is None:
                super(BongLog, self).save(*args, **kwargs)

                self.wallet.balance += self.getModifier()
                self.wallet.save()

    def getModifier(self):
        if self.action == self.ASSIGNED:
            return self.modify
        elif self.action in (self.CLAIMED, self.REVOKED):
            return -self.modify

    def delete(self, *args, **kwargs):
        return #no deleting of logs!

    wallet = models.ForeignKey(BongWallet)
    action = models.CharField(max_length=1, choices=BONG_ACTION_CHOICES, default=ASSIGNED)
    shift = models.OneToOneField(Shift, null=True)
    date = models.DateTimeField(default=datetime.now, blank=True)
    modify = models.IntegerField(default=0)
