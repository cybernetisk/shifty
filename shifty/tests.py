"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase

from django.contrib.auth.models import User
from django.test import TestCase
from django.test.client import RequestFactory
from shifty.views import take_shift
from shifty.models import Shift, Event, ShiftType

import datetime
from django.utils.timezone import utc

def now():
    return datetime.datetime.utcnow().replace(tzinfo=utc)

class SimpleTest(TestCase):
    def setUp(self):
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            username='barfunk', email='barfunk@cyb.no', password='top_secret')
        self.event = Event(start=now())
        self.event.save()
        self.shift_type = ShiftType(title="test")
        self.shift_type.save()
        self.shift = Shift(event=self.event, start=now(), stop=now(), shift_type = self.shift_type)
        self.shift.save()

    def test_01_take_shift(self):
        # Create an instance of a GET request.
        request = self.factory.get('/take_shift?id=%d&name=barfunk&comment=kommentar' % self.shift.id, )

        # Recall that middleware are not suported. You can simulate a
        # logged-in user by setting request.user manually.
        request.user = self.user

        # Test my_view() as if it were deployed at /customer/details
        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(shift.volunteer, self.user)
        self.assertEqual(shift.comment, "kommentar")

    def test_02_try_to_take_occupied_shift(self):
        # Create an instance of a GET request.
        user = User.objects.create_user(
            username='barfunk2', email='barfunk@cyb.no', password='top_secret')


        shift = Shift.objects.get(pk=self.shift.id)
        shift.volunteer = self.user
        shift.comment = "noe som ikke endres"
        shift.save()

        request = self.factory.get('/take_shift?id=%d&name=barfunk2&comment=lol' % self.shift.id, )

        request.user = user

        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(shift.volunteer, user)
        self.assertEqual(shift.comment, "noe som ikke endres")

    def test_03_user_can_update_comment_on_own_shift(self):
        shift = Shift.objects.get(pk=self.shift.id)
        shift.volunteer = self.user
        shift.comment = "noe som ikke endres"
        shift.save()

        request = self.factory.get('/take_shift?id=%d&name=barfunk&comment=larsrsgasrgol' % self.shift.id, )

        request.user = self.user

        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(shift.volunteer, self.user)
        self.assertEqual(shift.comment, "larsrsgasrgol")

    def test_03_user_can_be_removed(self):
        shift = Shift.objects.get(pk=self.shift.id)
        shift.volunteer = self.user
        shift.comment = "larsrsgasrgol"
        shift.save()

        request = self.factory.get('/take_shift?id=%d&name=' % self.shift.id, )

        request.user = self.user

        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(shift.volunteer, None)
        self.assertEqual(shift.comment, "larsrsgasrgol")