shifty.views.Events = Backbone.View.extend({
    tagName: "div",
    id: "events",

    events: {
        'click .view_shifts_columns': 'columnsView',
        'click .view_shifts_table': 'tableView'
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
        this.$el.html(Handlebars.templates.events());
        this.sub = this.$(".events_wrap");
        this.columnsView();
        return this.el;
    },

    columnsView: function(e)
    {
        if (e) e.preventDefault();
        this.sub.empty();
        this.collection.each(function(ev) {
            var v = new shifty.views.EventColumned({model: ev});
            this.sub.append(v.render());
        }.bind(this));
    },

    tableView: function(e)
    {
        if (e) e.preventDefault();
        this.sub.empty();
        this.sub.html(Handlebars.templates.event_list({
            'events': this.collection.toJSON()
        }));
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

        var self = this;
        var i = -1;
        shifts.each(function(shift)
        {
            i++;
            if (rowIndex == 0)
            {
                columns.push([]);
                colIndex++;
            }

            // shift.start = ... _date(self.start, "H:i")
            // shift.stop = ... _date(self.stop, "H:i")
            var data = shift.attributes;
            var cssClass = data.shift_type.title.toLowerCase();

            // the following shift
            var next = (i < shifts.models.length ? shifts.models[i+1] : null);
            twins.push(data);

            // add the shift to the active column if it has no next or next is no twin
            if (!next || !shift.isTwin(next))
            {
                columns[colIndex].push({
                    'shift': data,
                    'cssClass': cssClass,
                    'twins': twins,
                    'twinsCount': twins.length,
                    'hasTwins': twins.length > 1
                });
                twins = [];

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