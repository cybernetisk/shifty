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
        self.wallet = BongWallet(user=self.user, balance=0)
        self.wallet.save()

    def testAssignBongs(self):
        log = BongLog(wallet = self.wallet, action = BongLog.ASSIGNED, shift = self.shift, date = self.now, modify = 5)
        log.save()

        self.assertEqual(self.wallet.balance, 5)
