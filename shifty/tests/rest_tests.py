from django.core.urlresolvers import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from shifty.models import Shift, Event, ShiftType

class EventAndShiftTest(APITestCase):
    def test_event_fetch_by_date(self):
        e = Event(title="lol", start="2014-03-14").save()
        e2 = Event(title="lol", start="2014-03-15").save()
        e3 = Event(title="lol", start="2014-03-16").save()
        response = self.client.get('/rest/event/?min_date=2014-03-13', format='json')
        self.assertEqual(3, response.data['count'])
        response = self.client.get('/rest/event/?min_date=2014-03-14', format='json')
        self.assertEqual(3, response.data['count'])
        response = self.client.get('/rest/event/?min_date=2014-03-15', format='json')
        self.assertEqual(2, response.data['count'])
        response = self.client.get('/rest/event/?min_date=2014-03-16', format='json')
        self.assertEqual(1, response.data['count'])
        response = self.client.get('/rest/event/?min_date=2014-03-17', format='json')
        self.assertEqual(0, response.data['count'])
        response = self.client.get('/rest/event/?min_date=today', format='json')
        self.assertEqual(0, response.data['count'])

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
                                "shift_type":{'id':self.shift_type.id,
                                              'name':'lol'},
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
        a = Event(title="test", start="2013-12-13T01:00:00Z")
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

    def test_event_corny_case(self):
        """
        Corny case where we have multiple events at the same time.
        """
        a = Event(title="test", start="2013-12-13T01:00:00Z")
        a.save()
        b = Event(title="test", start="2013-12-14T02:00:00Z")
        b.save()
        c = Event(title="test", start="2013-12-15T02:00:00Z")
        c.save()
        # add a new event at the same time as b.
        d = Event(title="test", start="2013-12-14T02:00:00Z")
        d.save()

        self.assertEqual(a.next['id'], b.id)
        self.assertEqual(b.next['id'], d.id)
        self.assertEqual(d.next['id'], c.id)
        self.assertIsNone(c.next)

        self.assertIsNone(a.previous)
        self.assertEqual(b.previous['id'], a.id)
        self.assertEqual(d.previous['id'], b.id)
        self.assertEqual(c.previous['id'], d.id)
