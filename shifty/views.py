# Create your views here.
from django.shortcuts import render_to_response
from shifty.models import Shift, Event, ShiftType

def index(request):
    return render_to_response('shifty/index.html', {'name':'lol'})   

# added by marill 
def shifts(request):
    return render_to_response('shifty/shifts.html', {'shifts':Shift.objects.all()})    