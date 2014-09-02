# Create your views here.
from django.shortcuts import render_to_response
from shifty.models import Shift, Event, ShiftType, User, ContactInfo, WeekdayChangedException
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.core import serializers
import json
from django.forms.models import model_to_dict
from django.shortcuts import render
from django.http import HttpResponseRedirect
import reversion
from django.db import transaction
from django.contrib.auth.decorators import permission_required
from django.views.decorators.csrf import ensure_csrf_cookie
from datetime import date, timedelta
from django.db.models import Count

def eventInfo(request, eventId):
    event = Event.objects.get(id=eventId)

    p = {'event':event.toDict(), 'columns':event.getShiftColumns()}

    return HttpResponse(json.dumps(p), mimetype='application/json')

# added by marill 
def count_shifts(request):
    result = []
    for s in ShiftType.objects.all():
        result.append({'title': s.title,
                        'id': s.id,
                        'free': Shift.objects.filter(volunteer__isnull=True, shift_type=s.id, start__gte=date.today()).count(), 
                        'all': Shift.objects.filter(shift_type=s.id, start__gte=date.today()).count()})

    return HttpResponse(json.dumps(result), mimetype='application/json')


def best_volunteers(request):
    today = date.today()
    month = today.month
    year = today.year
    if month < 8:    
        term = date(year, 1, 1)
    else:
        term = date(year, 8, 1)

    users = User.objects.filter(shift__start__range=(term, today)).annotate(num_shifts=Count('shift')).order_by('-num_shifts')[:5]

    data = []
    for u in users:
        data.append({'user':u.username, 'num':u.num_shifts, 'id': u.id})
    return HttpResponse(json.dumps(data), mimetype='application/json')

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

    return HttpResponse(json.dumps(result), mimetype='application/json')

def create_shift_user(request):
    data = json.loads(request.body)

    username = data['username']
    firstname = data['firstname']
    lastname = data['lastname']
    email = data['email']
    phone = data['phone']

    user = User.objects.create_user(username, email, first_name=firstname, last_name=lastname)
    contact_info = ContactInfo(phone=phone)
    contact_info.user = user
    contact_info.save()

    return HttpResponse(json.dumps({'id': user.id}), mimetype='application/json')

@reversion.create_revision()
def take_shift(request):
    data = json.loads(request.body)

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
            return HttpResponse(json.dumps({'status':'ok'}), mimetype='application/json')

        user = User.objects.get(username=username)

        if user is not None:
            if shift.volunteer != None and user != shift.volunteer:
                return HttpResponse(json.dumps({'status':'taken'}), mimetype='application/json')

            shift.volunteer = user
            if comment is not None:
                shift.comment = comment
            shift.save()
            reversion.set_comment("Took shift")
            return HttpResponse(json.dumps({'status':'ok'}), mimetype='application/json')
    return HttpResponse(json.dumps({'status':'failed'}), mimetype='application/json')



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

@permission_required('event.can_create')
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
                copies = Event.copy_events(events, date)
                return HttpResponseRedirect("/admin/shifty/event/")
    else:
        form = CopyEventsForm(initial={'events':ids})
        form.fields["events"].queryset = events
        form.fields["events"].queryset = events
    return render(request, 'shifty/copy_events.html', dict(form=form))

@ensure_csrf_cookie
def backbone_router(request):
    return render_to_response('shifty/base.html')


def shift_types_colors(request):
    shift_types = ShiftType.objects.all()
    return render(request, 'shifty/shift_type.css', dict(shift_types=shift_types), content_type="text/css")
