# Create your views here.
from django.shortcuts import render_to_response
from shifty.models import Shift, Event, ShiftType
from django.http import HttpResponse

def index(request):
    return render_to_response('shifty/index.html', {'name':'lol'})   

# added by marill 
def shifts(request):
	columns = [[]]

	event = Event.objects.all()[0]
	shifts = event.getOrderedShifts()

	column = 0
	index = 0
	twinCount = 0
	
	for i, shift in enumerate(shifts):		
		next = "Empty"
		if(i+1 < len(shifts)):
			next = shifts[i+1]

		if(next == "Empty" or not shift.isTwin(next)):
			if shift.durationType() == 'long':
				columns[index].append({'shift':shift, 'twins':twinCount+1, 'durationType':shift.durationType()})
				column = 0
			elif shift.durationType()=='short':
				columns[index].append({'shift':shift, 'twins':twinCount+1, 'durationType':shift.durationType()})
				column += 1

			if (next != 'Empty' and str(next) != str(shift)):
				column = 0

			twinCount = 0
		else:
			twinCount += 1

		if(column == 0):
			columns.append([])
			index += 1


	#return HttpResponse(str(s))

	return render_to_response('shifty/shifts.html', {'event':event, 'columns':columns})
