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
import json

import datetime
from django.utils.timezone import utc


from rest_framework.test import APIRequestFactory

class SimpleTestCase(TestCase):
    def setUp(self):
        self.now = datetime.datetime.utcnow().replace(tzinfo=utc)
        # Every test needs access to the request factory.
        self.factory = RequestFactory()
        self.user = User.objects.create_user(
            username='barfunk', email='barfunk@cyb.no', password='top_secret')
        self.event = Event(start=self.now, title="abc", description="desc")
        self.event.save()
        self.shift_type = ShiftType(title="test")
        self.shift_type.save()
        self.shift = Shift(event=self.event, start=self.now, stop=self.now, shift_type = self.shift_type)
        self.shift.save()

    def test_take_shift(self):
        """

        """
        user = {'id':self.shift.id,
                'name':'barfunk',
                'comment':'kommentar'}
        user = json.dumps(user)
        request = self.factory.post('/take_shift', user, content_type='json')
        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(shift.volunteer, self.user)
        self.assertEqual(shift.comment, "kommentar")

    def test_try_to_take_occupied_shift(self):
        
        user = User.objects.create_user(
            username='barfunk2', email='barfunk@cyb.no', password='top_secret')

        shift = Shift.objects.get(pk=self.shift.id)
        shift.volunteer = self.user
        shift.comment = "noe som ikke endres"
        shift.save()

        user = {'id':self.shift.id,
                'name':'barfunk2',
                'comment':'lol'}
        user = json.dumps(user)
        request = self.factory.post('/take_shift', user, content_type='json')

        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertNotEqual(shift.volunteer, user)
        self.assertEqual(shift.comment, "noe som ikke endres")

    def test_user_can_update_comment_on_own_shift(self):
        shift = Shift.objects.get(pk=self.shift.id)
        shift.volunteer = self.user
        shift.comment = "noe som kan endres"
        shift.save()

        user = {'id':self.shift.id,
                'name':'barfunk',
                'comment':'larsrsgasrgol'}
        user = json.dumps(user)
        request = self.factory.post('/take_shift', user, content_type='json')

        request.user = self.user

        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(shift.volunteer, self.user)
        self.assertEqual(shift.comment, "larsrsgasrgol")

    def test_user_can_be_removed(self):
        shift = Shift.objects.get(pk=self.shift.id)
        shift.volunteer = self.user
        shift.comment = "larsrsgasrgol"
        shift.save()

        user = {'id':self.shift.id,
                'name':''}
        user = json.dumps(user)
        request = self.factory.post('/take_shift', user, content_type='json')

        request.user = self.user

        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(shift.volunteer, None)
        self.assertEqual(shift.comment, "larsrsgasrgol")

