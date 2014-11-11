shifty.views.EventColumned = Backbone.View.extend({
    events: {
        'click .shift': 'takeShift'
    },

    initialize: function(el) {

    },

    render: function() {

        this.el.innerHTML = shifty.template("event_columned")({
            'event': this.model.toJSON(),
            'columns': this.getShiftColumns(),
            'responsible': this.model.responsible,
            'user':shifty.user
        });

        return this.el;
    },

    takeShift: function(ev)
    {
        // fint the shift element
        var shiftElm = $(ev.currentTarget);
        if (!shiftElm.hasClass("shift")) shiftElm = shiftElm.parent(".shift");

        // find data for this block
        var shift_id = shiftElm.attr('id').substring(6);
        var twinsData = this.grouplinks[shift_id];

        // generate take shift-box
        twinsData = $.extend(twinsData, {'event': this.model.toJSON()});
        this.parentView.takeShiftBox(shiftElm, twinsData);
    },

    /**
     * Structure data to be used in columns
     */
    getShiftColumns: function()
    {
        var columns = [];
        //var shifts = this.model.get('shifts').sort(this.sortByShiftType);
        var shifts = this.model.shifts;

        var rowIndex = 0;
        var colIndex = -1;
        var twinCount = 0;
        var twins = [];
        var shiftsCollection = new shifty.collections.Shifts();

        var self = this;
        var i = -1;
        var available = false;
        this.grouplinks = {};
        shifts.each(function(shift)
        {
            i++;
            if (rowIndex === 0)
            {
                columns.push([]);
                colIndex++;
            }

            // shift.start = ... _date(self.start, "H:i")
            // shift.stop = ... _date(self.stop, "H:i")
            var data = shift.attributes;
            var cssClass = "shift_type_" +  data.shift_type.id;

            // the following shift
            var next = (i < shifts.models.length ? shifts.models[i+1] : null);
            twins.push(data);
            shiftsCollection.add(shift);
            if (!data.volunteer) available = true;

            // add the shift to the active column if it has no next or next is no twin
            if (!next || !shift.isTwin(next))
            {
                var free = 0;
                var ownshift = false;
                for(var j = 0; j < twins.length; j++)
                {
                    if(twins[j].volunteer == undefined)
                        free += 1;
                    if(twins[j].volunteer != null && shifty.user != null && twins[j].volunteer.id == shifty.user.id)
                        ownshift = true;
                }

                columns[colIndex].push({
                    'shift': data,
                    'cssClass': cssClass,
                    'twins': twins,
                    'shiftsCollection': shiftsCollection,
                    'twinsCount': twins.length,
                    'freeCount': free,
                    'hasTwins': twins.length > 1,
                    'available': available,
                    'ownshift':ownshift
                });
                self.grouplinks[data.id] = columns[colIndex][columns[colIndex].length-1];
                twins = [];
                shiftsCollection = new shifty.collections.Shifts();
                available = false;

                rowIndex = (data.durationType == 'long' ? 0 : rowIndex + 1);
                if (next && data.shift_type.title != next.attributes.shift_type.title)
                {
                    rowIndex = 0;
                }
            }
        });

        return columns;
    }
});
