from django.db import models, transaction
from django.contrib.auth.models import User
from shifty.models import Shift

class BongWallet(models.Model):
    user = models.ForeignKey(User)
    balance = models.IntegerField(default=0)

    def delete(self, *args, **kwargs):
        return #no deleting of bong wallets!

    def calcBalance(self):
        self.balance = 0
        logs = query = BongLog.objects.filter(wallet__exact=self)

        for log in logs:
            if log.action == BongLog.ASSIGNED:
                self.balance += log.modify
            elif log.action in (BongLog.CLAIMED, BongLog.REVOKED):
                self.balance -= log.modify

        self.save()

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

            if self.id is None:
                super(BongLog, self).save(*args, **kwargs)

                if self.action == self.ASSIGNED:
                    self.wallet.balance += self.modify
                elif self.action in (self.CLAIMED, self.REVOKED):
                    self.wallet.balance -= self.modify

                self.wallet.save()

    def delete(self, *args, **kwargs):
        return #no deleting of logs!

    wallet = models.ForeignKey(BongWallet)
    action = models.CharField(max_length=1, choices=BONG_ACTION_CHOICES, default=ASSIGNED)
    shift = models.OneToOneField(Shift, null=True)
    date = models.DateTimeField()
    modify = models.IntegerField(default=0)
