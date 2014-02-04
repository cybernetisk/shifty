shifty.models.Shift = Backbone.Model.extend({
    urlRoot: "/rest/shift/",

    initialize: function(attrs) {
        var self = this;
    },

    validate: function(attrs, options) {
        var required = ["count", "shifttype", "start", "stop", "title"];
        var errors = [];

        for (var i in attrs) {
            if (attrs[i] === "") errors.push({i: "Må være satt"});
        }

        if (!errors.start && attrs.start && !attrs.start.match(/(0[0-9]|1[0-9]|2[0-3])([:\.][0-5][0-9])/))
            errors.start = "Må være på formatet HH:MM";

        if (!errors.stop && attrs.stop && !attrs.stop.match(/(0[0-9]|1[0-9]|2[0-3])([:\.][0-5][0-9])/))
            errors.stop = "Må være på formatet HH:MM";

        if (errors.length > 0) return errors;
    },

    setDate: function(date) {
        // Update start and stop to be static dates, not relative times
    }
});

shifty.collections.Shift = Backbone.Collection.extend({
    model: shifty.models.Shift
});

shifty.models.Event = Backbone.Model.extend({
    initialize: function(attributes) {
        this.shifts = new shifty.collections.Shift(attributes.shifts);
    }

    /**
     * Sort function to sort shifts by its shift type
     */
    /*shiftsByShiftType: function(left, right)
    {
        return right.get('shift_type') - left.get('shift_type');
    },

    getShiftColumns: function()
    {
        var columns = [];
        // self -> event

        // sort shifts by its type
        this.shifts.comparator = this.shiftsByShiftType;
        var shifts = this.shifts.sort();

        var rowIndex = 0;
        var colIndex = -1;
        var twinCount = 0;
        var twins = [];

        for (var i = this.shifts.size() - 1; i >= 0; i--) {
            if (rowIndex == 0)
            {
                columns.push([]);
                colIndex++;
            }

            // shift.start = ... _date(self.start, "H:i")
            // shift.stop = ... _date(self.stop, "H:i")
            var shift = this.shifts.at().toJson();
            shift.cssClass = shift.get('shift_type').title.toLowerCase();

            // the following shift
            var next = (this.shifts.at() < this.shifts.length ? this.shifts[this.shifts.at()+1] : null);
            twins.push(shift);

            // add the shift to the active column if it has no next or next is no twin
            if (!next || !shiftIsTwin(shift, next))
            {
                columns[colIndex].push({
                    'shift': shift, // used only for common data
                    'twins': twins,
                    'twinsCount': twins.length,
                    'hasTwins': twins.length > 1
                });
                twins = [];

                rowIndex = (shift.durationType == 'long' ? 0 : rowIndex + 1);
                if (next && shift.shift_type.title != next.shift_type.title)
                {
                    rowIndex = 0;
                }
            }
        };

        return columns;
    }*/
});

shifty.collections.Events = Backbone.Collection.extend({
    model: shifty.models.Event,
    page: 1,
    url: function() {
        // TODO: use https://github.com/backbone-paginator/backbone.paginator ?
        // TODO: handle 404 if page not found
        return '/rest/event/?' + $.param({page: this.page, page_size: 10});
    },
    parse: function(data) {
        return data.results;
    }
});