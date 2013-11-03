# Create your views here.
from django.shortcuts import render_to_response
from shifty.models import Shift, Event, ShiftType
from django.http import HttpResponse
from django.core import serializers
from django.utils import simplejson
from django.forms.models import model_to_dict

def index(request):
    return render_to_response('shifty/index.html', {'name':'lol'})   


def eventInfo(request, eventId):
	event = Event.objects.get(id=eventId)

	p = {'event':event.toDict(), 'columns':event.getShiftColumns()}

	return HttpResponse(simplejson.dumps(p), mimetype='application/json')

# added by marill 
def shifts(request):
	events = Event.objects.all()
	return render_to_response('shifty/shifts.html', {'events':events})

def getEvents(request, offset, limit):
	events = Event.objects.order_by('-start')[offset:offset+limit]
	result = []
	for e in events:
		result.append({'event':e.toDict(), 'columns':e.getShiftColumns()})

	return HttpResponse(simplejson.dumps(result), mimetype='application/json')