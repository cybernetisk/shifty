# Create your views here.
from django.shortcuts import render_to_response
from shifty.models import Shift, Event, ShiftType, User, ContactInfo, WeekdayChangedException, ShiftEndReport
from shifty.models import ShiftTakeException
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth import login as django_login
from django.contrib.auth import logout

import django
from django.http import HttpResponse, JsonResponse
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
import datetime
from django.utils import timezone


from django.forms.models import inlineformset_factory, modelformset_factory, formset_factory

def eventInfo(request, eventId):
    event = Event.objects.get(id=eventId)
    p = {'event':event.toDict(), 'columns':event.getShiftColumns()}
    return JsonResponse(p)

def logout_view(request):
    logout(request)
    return HttpResponseRedirect('/')

def get_user_stuff(request):
    user = request.user
    return {'username':user.username, 'id':user.id, 'admin':user.is_staff}

def login(request):
    user = request.POST['username']
    password = request.POST['password']
    user = authenticate(username=user, password=password)
    if user is not None and user.is_active:
        res = django_login(request, user)
        csrf = django.middleware.csrf.get_token(request)
        return JsonResponse({'status':'ok', 'csrf':csrf, 'user':get_user_stuff(request)})
    return JsonResponse({'status':'failed'})


# # added by marill 
# def count_shifts(request):
#     result = []
#     for s in ShiftType.objects.all():
#         result.append({'title': s.title,
#                         'id': s.id,
#                         'free': Shift.objects.filter(volunteer__isnull=True, shift_type=s.id, start__gte=date.today()).count(), 
#                         'all': Shift.objects.filter(shift_type=s.id, start__gte=date.today()).count()})

#     return JsonResponse({'result':result})


# def best_volunteers(request):
#     today = date.today()
#     month = today.month
#     year = today.year
#     if month < 8:    
#         term = date(year, 1, 1)
#     else:
#         term = date(year, 8, 1)

#     users = User.objects.filter(shifts__start__range=(term, today)).annotate(num_shifts=Count('shifts')).order_by('-num_shifts')[:5]

#     data = []
#     for u in users:
#         data.append({'user':u.username, 'num':u.num_shifts, 'id': u.id})
#     return JsonResponse({'result':data})

def shifts(request):
    events = Event.objects.all()
    return render_to_response('shifty/shifts.html', {'events':events})

def whoami(request):
    if request.user:
        whoami = get_user_stuff(request)
    else:
        whoami = {}
    return JsonResponse(whoami)

@ensure_csrf_cookie
def angular_router(request):
    user = None
    if request.user.is_authenticated():
        user = request.user
    return render_to_response('shifty/angular.html', {'user':user})

import json
@reversion.create_revision()
def take_shift(request):
    json_data = json.loads(request.read())
    if not 'username' in json_data:
        user = request.user
    else:
        username = json_data['username']
        try:
            user = User.objects.get(username=username)
        except:
            user = User.objects.create_user(username, None, first_name=username, last_name="", password=username)
            contact_info = ContactInfo()
            contact_info.user = user
            contact_info.auto_user = True
            contact_info.claimed = False
            contact_info.save()

    shift_id = json_data['shift_id']
    #shift_id = request.POST['shift_id']
    shift = Shift.objects.get(pk=shift_id)

    with transaction.atomic(), reversion.create_revision():
        if shift.volunteer != None:# and user != shift.volunteer:
            return JsonResponse({'status':'taken'})
        try:
            shift.assign(user)
            shift.save()
            reversion.set_comment("Took shift")
        except ShiftTakeException as ex:
            return JsonResponse(ex.as_json())

        return JsonResponse({'status':'ok'})
    return JsonResponse({'status':'failed'})


@reversion.create_revision()
def free_shift(request):
    json_data = json.loads(request.read())
    shift_id = json_data['shift_id']

    shift = Shift.objects.get(pk=shift_id)

    with transaction.atomic(), reversion.create_revision():
        removed_user = shift.volunteer
        shift.unassign()
        shift.save()
        reversion.set_comment("Removed from shift")

        try:
            if removed_user.contactinfo.auto_user and not removed_user.contactinfo.claimed and removed_user.shifts.count() == 0:
                removed_user.delete()
        except AttributeError:
            pass
        return JsonResponse({'status':'ok'})
    return JsonResponse({'status':'failed', 'reason':'unknown'})

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
        event = Event.objects.filter(id__in=ids).order_by('start').first()
        form = CopyEventsForm(initial={'events':ids, 'date':event.start + datetime.timedelta(days=7)})
        form.fields["events"].queryset = events
    return render(request, 'shifty/copy_events.html', dict(form=form))


@ensure_csrf_cookie
def backbone_router(request):
    if request.user.is_authenticated():
        user = get_user_stuff(request)
        user = json.dumps(user)
    else:
        user = None

    return render_to_response('shifty/base.html', dict(user=user))


def shift_types_colors(request):
    shift_types = ShiftType.objects.all()
    return render(request, 'shifty/shift_type.css', dict(shift_types=shift_types), content_type="text/css")

from django.forms import ModelForm
class EventEndForm(ModelForm):
    class Meta:
        model = Event
        exclude = ['']

class ShiftEndReportForm(ModelForm):
    def __init__(self, *args, **kwargs):
        super(ShiftEndReportForm, self).__init__(*args, **kwargs)
        instance = getattr(self, 'instance', None)
        if instance and instance.pk:
            self.fields['signed'].widget.attrs['readonly'] = True

    class Meta:
        model = ShiftEndReport
        fields = ['verified', 'corrected_hours', 'signed']
        exclude = []

def event_verify(request, eventId):
    eventFormset = formset_factory(ShiftEndReportForm)
    event = Event.objects.get(id=eventId)
    shifts = []
    for shift in event.shifts.all():
        end_report = dict(shift_id=shift.id, event_id=event.id, verified=False, signed=request.user)
        shifts.append(end_report)
    print shifts
    form = eventFormset(initial=shifts)

    return render_to_response('shift_verify.html', dict(form=form))
