shifty.views.Events = Backbone.View.extend({
    tagName: "div",
    id: "events",

    events: {
    },

    initialize: function(el) {
        // TODO: pagination links and handling
        /*var limit = 5;
        var offset = 1;

        this.eventViews = [];
        this.limit = 5;
        this.offset = 1;*/
    },

    render: function() {
        this.collection.each(function(ev) {
            var v = new shifty.views.EventColumned({model: ev});
            this.$el.append(v.render());
        }.bind(this));

        return this.el;
    }
});

shifty.views.EventColumned = Backbone.View.extend({
    events: {
    },

    initialize: function(el) {
        
    },

    render: function() {
        this.el.innerHTML = Handlebars.templates.event_columned({
            'event': this.model.toJSON(),
            'columns': this.getShiftColumns()
        });

        // autocomplete users
        this.$('input.user_search').typeahead({
            name: 'user',
            remote: {
                url: '/rest/user/?search=%QUERY',
                filter: function(data)
                {
                    var d = [];
                    $(data.results).each(function(i, node)
                    {
                        concat = node.first_name && node.last_name ? " " : "";
                        d.push({
                            value: node.username,
                            tokens: [node.username, node.first_name, node.last_name],
                            name: node.first_name + concat + node.last_name
                        });
                    });
                    return d;
                }
            }
        });

        return this.el;
    },

    /**
     * Sort function to sort shifts by its shift type
     */
    sortByShiftType: function(left, right)
    {
        return right.shift_type.title - left.shift_type.title;
    },

    /**
     * Check if two shifts is considered to be twins
     */
    shiftIsTwin: function(left, right)
    {
        return (left.shift_type.id == right.shift_type.id
             && left.start == right.start
             && left.stop == right.stop);
    },

    /**
     * Structure data to be used in columns
     */
    getShiftColumns: function()
    {
        var columns = [];
        // self -> event

        // sort shifts by its type
        var shifts = this.model.get('shifts').sort(this.sortByShiftType);

        var rowIndex = 0;
        var colIndex = -1;
        var twinCount = 0;
        var twins = [];

        var self = this;
        $.each(shifts, function(i, shift)
        {
            if (rowIndex == 0)
            {
                columns.push([]);
                colIndex++;
            }

            // shift.start = ... _date(self.start, "H:i")
            // shift.stop = ... _date(self.stop, "H:i")
            shift.cssClass = shift.shift_type.title.toLowerCase();

            // the following shift
            var next = (i < shifts.length ? shifts[i+1] : null);
            twins.push(shift);

            // add the shift to the active column if it has no next or next is no twin
            if (!next || !self.shiftIsTwin(shift, next))
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
        });

        return columns;
    }
});