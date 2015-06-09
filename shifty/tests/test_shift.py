from django.test import TestCase
from django.contrib.auth.models import User
from shifty.models import Shift, Event, ShiftType, ShiftTaken, ShiftCollides
from django.utils import timezone

class SimpleTestCase(TestCase):
    def setUp(self):
        self.now = timezone.now()
        # Every test needs access to the request factory.
        self.user = User.objects.create_user(
            username='barfunk', email='barfunk@cyb.no', password='top_secret')
        self.event = Event(start=self.now, title="abc", description="desc")
        self.event.save()
        self.shift_type = ShiftType(title="test")
        self.shift_type.save()
        self.shift = Shift(event=self.event, start=self.now, stop=self.now + timezone.timedelta(hours=3), shift_type = self.shift_type)
        self.shift.save()

    def test_take_shift(self):
        self.shift.assign(self.user)
        self.assertEqual(self.shift.volunteer, self.user)

    def test_try_to_take_occupied_shift(self):
        other_user = User.objects.create_user(
            username='barfunk2', email='barfunk@cyb.no', password='top_secret')
        self.shift.assign(self.user)
        with self.assertRaises(ShiftTaken):
            self.shift.assign(other_user)

    def test_untake_shift(self):
        self.shift.assign(self.user)
        self.assertEqual(self.shift.volunteer, self.user)

        self.shift.unassign()
        self.assertEqual(self.shift.volunteer, None)

    def test_shift_collides(self):
        self.shift.assign(self.user)
        self.shift.save()

        other_shift = Shift(event=self.event, start=self.now, stop=self.now + timezone.timedelta(hours=3), shift_type = self.shift_type)
        with self.assertRaises(ShiftCollides):
            other_shift.assign(self.user)
