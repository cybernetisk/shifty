# Create your views here.
from django.shortcuts import render_to_response
from shifty.models import Shift, Event, ShiftType
from django.contrib.auth.models import User
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
    events = Event.objects.order_by('start')[offset:offset+limit]
    result = []
    for e in events:
        result.append({'event':e.toDict(), 'columns':e.getShiftColumns()})

    return HttpResponse(simplejson.dumps(result), mimetype='application/json')

def take_shift(request):
    username = request.REQUEST['name']
    comment = request.REQUEST['comment'] if 'comment' in request.REQUEST else None

    shift_id = request.REQUEST['id']
    shift = Shift.objects.get(pk=shift_id)

    if username == "":
        if shift.volunteer != None:
            shift.volunteer = None
            if comment is not None:
                shift.comment = comment
            shift.save()
        return HttpResponse(simplejson.dumps({'status':'ok'}), mimetype='application/json')

    user = User.objects.get(username=username)
    if user is not None:
        if shift.volunteer != None and user != shift.volunteer:
            return HttpResponse(simplejson.dumps({'status':'taken'}), mimetype='application/json')

        shift.volunteer = user
        if comment is not None:
            shift.comment = comment
        shift.save()
        return HttpResponse(simplejson.dumps({'status':'ok'}), mimetype='application/json')
    return HttpResponse(simplejson.dumps({'status':'failed'}), mimetype='application/json')