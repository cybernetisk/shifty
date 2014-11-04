import datetime
from django.utils.timezone import utc

from django.test import TestCase
from django.contrib.auth.models import User
from shifty.models import Shift, Event, ShiftType
from bong.models import BongWallet, BongLog

class BongTestCase(TestCase):
    def setUp(self):
        self.now = datetime.datetime.utcnow().replace(tzinfo=utc)
        self.user = User.objects.create_user(
            username='barfunk', email='barfunk@cyb.no', password='top_secret')
        self.event = Event(start=self.now, title="abc", description="desc")
        self.event.save()
        self.shift_type = ShiftType(title="test")
        self.shift_type.save()
        self.shift = Shift(event=self.event, start=self.now, stop=self.now, shift_type = self.shift_type)
        self.shift.save()
        self.wallet = BongWallet(user=self.user, balance=7)
        self.wallet.save()

    def testAssignBong(self):
        log = BongLog(wallet = self.wallet, action = BongLog.ASSIGNED, shift = self.shift, date = self.now, modify = 5)
        log.save()

        self.assertEqual(self.wallet.balance, 12)

    def testClaimBong(self):
        log = BongLog(wallet = self.wallet, action = BongLog.CLAIMED, shift = self.shift, date = self.now, modify = 5)
        log.save()

        self.assertEqual(self.wallet.balance, 2)

    def testRevokeBong(self):
        log = BongLog(wallet = self.wallet, action = BongLog.REVOKED, shift = self.shift, date = self.now, modify = 4)
        log.save()

        self.assertEqual(self.wallet.balance, 3)

    def testImmutableBongLogEntry(self):
        log = BongLog(wallet = self.wallet, action = BongLog.ASSIGNED, shift = self.shift, date = self.now, modify = 5)
        log.save()

        log.modify = 100;
        log.save()

        self.assertEqual(self.wallet.balance, 12)

    def testDeleteBongLogDisabled(self):
        log = BongLog(wallet = self.wallet, action = BongLog.ASSIGNED, shift = self.shift, date = self.now, modify = 5)
        log.save()
        log.delete()

        query = BongLog.objects.get(id=1)
        self.assertIsNotNone(query)

    def testDeleteBongWalletDisabled(self):
        self.wallet.delete()

        query = BongWallet.objects.get(id=1)
        self.assertIsNotNone(query)

    def testCalcBongWalletBalance(self):
        log1 = BongLog(wallet = self.wallet, action = BongLog.ASSIGNED, shift = self.shift, date = self.now, modify = 1)
        log1.save()
        log2 = BongLog(wallet = self.wallet, action = BongLog.ASSIGNED, date = self.now, modify = 2)
        log2.save()
        log3 = BongLog(wallet = self.wallet, action = BongLog.CLAIMED, date = self.now, modify = 5)
        log3.save()

        self.assertEqual(self.wallet.balance, 5)

        self.wallet.balance = 1000
        self.wallet.save()

        self.assertEqual(self.wallet.balance, 1000)

        self.wallet.calcBalance()
        self.wallet.save()

        self.assertEqual(self.wallet.balance, 5 - 7)
