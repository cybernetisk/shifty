# Create your views here.
from django.shortcuts import render_to_response
from shifty.models import Shift, Event, ShiftType, ContactInfo, WeekdayChangedException
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.core import serializers
from django.utils import simplejson
from django.forms.models import model_to_dict
from django.shortcuts import render
from django.http import HttpResponseRedirect
import reversion
from django.db import transaction


def eventInfo(request, eventId):
    event = Event.objects.get(id=eventId)

    p = {'event':event.toDict(), 'columns':event.getShiftColumns()}

    return HttpResponse(simplejson.dumps(p), mimetype='application/json')

# added by marill 
def shifts(request):
    events = Event.objects.all()
    return render_to_response('shifty/shifts.html', {'events':events})

def test(request):
    events = Event.objects.all()
    return render_to_response('shifty/test.html', {'events':events})

def getEvents(request, offset, limit):
    events = Event.objects.order_by('start')[offset:offset+limit]
    result = []
    for e in events:
        result.append({'event':e.toDict(), 'columns':e.getShiftColumns()})

    return HttpResponse(simplejson.dumps(result), mimetype='application/json')

def create_shift_user(request):
    data = simplejson.loads(request.body)

    username = data['username']
    firstname = data['firstname']
    lastname = data['lastname']
    password = 'hemmelig'  # todo: generate password automagically.
    email = data['email']
    phone = data['phone']

    user = User.objects.create_user(username, email, password, first_name=firstname, last_name=lastname)
    contact_info = ContactInfo(phone=phone)
    contact_info.user = user
    contact_info.save()

    return {'id':user.id}

@reversion.create_revision()
def take_shift(request):
    data = simplejson.loads(request.body)

    username = data['name']
    comment = data['comment'] if 'comment' in data else None
    shift_id = data['id']
    shift = Shift.objects.get(pk=shift_id)


    with transaction.atomic(), reversion.create_revision():
        if username == "":
            if shift.volunteer != None:
                shift.volunteer = None
                if comment is not None:
                    shift.comment = comment
                reversion.set_comment("Removed user from shift")
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
            reversion.set_comment("Took shift")
            return HttpResponse(simplejson.dumps({'status':'ok'}), mimetype='application/json')
    return HttpResponse(simplejson.dumps({'status':'failed'}), mimetype='application/json')



from django import forms

from django.forms.extras.widgets import SelectDateWidget
class CopyEventsForm(forms.Form):
    date = forms.DateField(widget=SelectDateWidget)
    check_same_day = forms.BooleanField(initial=True, required=False)
    events = forms.ModelMultipleChoiceField(queryset=Event.objects.all(),
                                            widget=forms.CheckboxSelectMultiple)
    """def clean(self):
        cleaned_data = super(CopyEventsForm, self).clean()
        date = cleaned_data.get('date')
        events = cleaned_data.get('events')

        try:
            Event.check_same_day(events, date)
        except WeekdayChangedException as ex:
            raise forms.ValidationError(ex.message)"""

def copy_events(request):
    ids = map(int, request.REQUEST['ids'].split(","))
    events = Event.objects.filter(id__in=ids).order_by('start').all()
    if request.method == 'POST': # If the form has been submitted...
        form = CopyEventsForm(request.POST)
        form.fields["events"].queryset = events
        if form.is_valid():
            if form.cleaned_data['check_same_day']:
                date = form.cleaned_data['date']
                events = form.cleaned_data['events']
                try:
                    Event.check_same_day(events, date)
                except WeekdayChangedException as ex:
                    form.errors['date'] = [ex.message]

            if not form.errors:
                events = form.cleaned_data['events']
                date = form.cleaned_data['date']
                with transaction.atomic(), reversion.create_revision():
                    copies = Event.copy_events(events, date)
                    reversion.set_comment("Copied events")
                return HttpResponseRedirect("/admin/shifty/event/")
    else:
        form = CopyEventsForm(initial={'events':ids})
        form.fields["events"].queryset = events
        form.fields["events"].queryset = events
    return render(request, 'shifty/copy_events.html', dict(form=form))

def backbone_router(request):
    return render_to_response('shifty/base.html')