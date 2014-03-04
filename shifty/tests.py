"""
This file demonstrates writing tests using the unittest module. These will pass
when you run "manage.py test".

Replace this with more appropriate tests for your application.
"""

from django.test import TestCase

from django.contrib.auth.models import User
from django.test import TestCase
from django.test.client import RequestFactory
from shifty.views import take_shift, create_shift_user
from shifty.models import Shift, Event, ShiftType

import datetime
from django.utils.timezone import utc


from rest_framework.test import APIRequestFactory


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

    def test_take_shift(self):
        """

        """
        request = self.factory.get('/take_shift?id=%d&name=barfunk&comment=kommentar' % self.shift.id, )
        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(shift.volunteer, self.user)
        self.assertEqual(shift.comment, "kommentar")

    def test_create_shift_user(self):
        request = self.factory.get('/create_shift_user?username=barfunk2&email=lol&password=test&phone_number=123455')
        response = create_shift_user(request)

        user = User.objects.get(username="barfunk2")
        self.assertEqual(user.username, "barfunk2")
        self.assertEqual(user.contactinfo.phone_number, "123455")
        self.assertEqual(user.email, "lol")

    def test_try_to_take_occupied_shift(self):
        
        user = User.objects.create_user(
            username='barfunk2', email='barfunk@cyb.no', password='top_secret')

        shift = Shift.objects.get(pk=self.shift.id)
        shift.volunteer = self.user
        shift.comment = "noe som ikke endres"
        shift.save()

        request = self.factory.get('/take_shift?id=%d&name=barfunk2&comment=lol' % self.shift.id, )

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

        request = self.factory.get('/take_shift?id=%d&name=barfunk&comment=larsrsgasrgol' % self.shift.id, )

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

        request = self.factory.get('/take_shift?id=%d&name=' % self.shift.id, )

        request.user = self.user

        response = take_shift(request)

        shift = Shift.objects.get(pk=self.shift.id)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(shift.volunteer, None)
        self.assertEqual(shift.comment, "larsrsgasrgol")



from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase

class EventAndShiftTest(APITestCase):
    def test_create_event_with_no_shifts(self):
        data = {
                "title": "lol", 
                "description": "ajsriosjgor", 
                "start": "2013-10-09T16:00:00Z", 
                "shifts": []
            }
        response = self.client.post('/rest/event/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = Event.objects.filter(title='lol', description='ajsriosjgor').all()
        self.assertEqual(1, len(data))

    def test_create_multiple_shifts_in_one_post(self):
        self.shift_type = ShiftType(title="test")
        self.shift_type.save()

        data = \
            {
                "title": "l4ol", 
                "description": "ajsriosjgor", 
                "start": "2013-10-09T16:00:00Z", 
                "shifts": [{
                                "shift_type_id":self.shift_type.id,
                                "start": "2013-12-13T20:00:00Z", 
                                "stop": "2013-12-14T01:00:00Z", 
                                "comment": "", 
                            },
                            {
                                "shift_type_id":self.shift_type.id, 
                                "start": "2013-12-13T20:00:00Z", 
                                "stop": "2013-12-14T01:00:00Z", 
                                "comment": "", 
                            }]
            }
        response = self.client.post('/rest/event/', data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(isinstance(response.data, dict))
        self.assertEqual(2, len(response.data['shifts']))
        
        data = Event.objects.filter(title='l4ol', description='ajsriosjgor').all()
        
        self.assertEqual(1, len(data))

        shifts = Shift.objects.all()
        self.assertEqual(2, len(shifts))



    def test_create_event_with_bad_shift(self):
        self.shift_type = ShiftType(title="test")
        self.shift_type.save()

        data = \
            {
                "title": "l4ol", 
                "description": "ajsriosjgor", 
                "start": "2013-10-09T16:00:00Z", 
                "shifts": [{
                                "shift_type_id":self.shift_type.id, 
                                "start": "2013-12-13T20:00:00Z", 
                                "stop": "2013-12-14T01:00:00Z", 
                                "comment": "", 
                            },
                            {
                                "shift_type_id":self.shift_type.id, 
                                "start": "jarigjaosirgZ", 
                                "stop": "2013-12-14T01:00:00Z", 
                                "comment": "", 
                            }]
            }
        response = self.client.post('/rest/event/', data, format='json')
        # Since one of the shifts had a invalid date we should have one error.
        self.assertEqual(1, len(response.data['errors']))

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = Event.objects.filter(title='l4ol', description='ajsriosjgor').all()

        # we should have one data entry
        self.assertEqual(1, len(data))

        # We should still have one shift
        shifts = Shift.objects.all()
        self.assertEqual(1, len(shifts))

    def test_event_next(self):
        a = Event(title="test", start="2013-12-14T01:00:00Z")
        a.save()
        b = Event(title="test", start="2013-12-14T02:00:00Z")
        b.save()
        c = Event(title="test", start="2013-12-15T02:00:00Z")
        c.save()

        self.assertEqual(a.next['id'], b.id)
        self.assertEqual(b.next['id'], c.id)
        self.assertIsNone(c.next)

        self.assertIsNone(a.previous)
        self.assertEqual(b.previous['id'], a.id)
        self.assertEqual(c.previous['id'], b.id)


