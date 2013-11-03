shifty.views.Popout = Backbone.View.extend({
    el: $('<div id="popout" class="popout"></div>'),

    events: {
        "click .close-button": "hide"
    },

    initialize: function(el) {
        $("body").append(this.el);

        this.views = [];
    },

    render: function() {
        var html = Handlebars.templates.popout({});
        this.$el.html(html);

        var bar = new shifty.views.BarShifts({
            el: this.$el.find(".popout-content"),
            model: new shifty.models.Event({date: new Date()})
        });
        bar.render();
        this.views.push(bar);
    },

    show: function() {
        this.$el.addClass("open");
    },

    hide: function() {
        this.$el.removeClass("open");
    }
});

shifty.views.BarShifts = Backbone.View.extend({
    el: $('<div class="popout"></div>'),

    state: {
        datepicker: true
    },

    events: {
        "select .datepicker": "selectedDate",
        "resize .datepicker": "resizeDate",
        "click .date-header": "toggleDatepicker",
        "click #save-shifts": "save",
        "keyup #event-comment": "comment"
    },

    initialize: function(){
        this.shifts = new shifty.collections.Shift();
    },

    render: function(){
        var context = this.model.toJSON();
        context.shifts = this.shifts.toJSON();

        console.log(context);

        // Get and render the template
        var html = Handlebars.templates['sidebar.bar'](context);
        this.$el.html(html);

        var shiftList = new shifty.views.ShiftList({
            el: this.$el.find(".shifts"),
            collection: this.shifts,
            parent: this
        });
        shiftList.render();

        var d = this.model.get("date");

        // Initialize the datepicker
        this.$el.find(".datepicker").datepicker();

        // Set the selected date
        this.$el.find(".selected-date").html(d.getDate() + ". "+months[d.getMonth()]+" "+d.getFullYear());
    },

    resizeDate: function(e) {
        this.$el.find("#sidebar-bar-date").css({height: 73+$(e.target).height()});
    },

    selectedDate: function(e, d) {
        this.model.set({date: d});

        this.$el.find(".selected-date").html(d.getDate() + ". "+months[d.getMonth()]+" "+d.getFullYear());

        this.toggleDatepicker();
    },

    toggleDatepicker: function(e) {
        if (this.state.datepicker) {
            this.$el.find("#sidebar-bar-date").css({height: 60});
            this.$el.find(".datepicker").css({visibility: "hidden", opacity: 0});
            this.state.datepicker = false;
        } else {
            this.$el.find("#sidebar-bar-date").css({height: 73+this.$el.find(".datepicker").height()});
            this.$el.find(".datepicker").css({visibility: "visible", opacity: 1});
            this.state.datepicker = true;
        }
    },

    insertDefaults: function() {
        var shifts = [{
            count: 1,
            shifttype: "Skjenkemester",
            start: "17:00",
            stop: "03:00"
        }, {
            count: 2,
            shifttype: "Barfunk",
            start: "17:30",
            stop: "22:00"
        }, {
            count: 2,
            shifttype: "Barfunk",
            start: "21:30",
            stop: "03:00"
        }, {
            count: 1,
            shifttype: "Vakt",
            start: "17:30",
            stop: "00:00"
        }, {
            count: 1,
            shifttype: "Vakt",
            start: "20:00",
            stop: "03:00"
        }, {
            count: 1,
            shifttype: "DJ",
            start: "17:30",
            stop: "22:00"
        }, {
            count: 1,
            shifttype: "DJ",
            start: "21:30",
            stop: "03:00"
        }];

        for (var i in shifts) {
            this.shifts.add(new shifty.models.Shift(shifts[i]));
        }

        this.render();

        return false;
    },

    addShift: function(e) {
        var $form = $(e.target);
        var fields = $form.serializeArray();
        var shift = {};

        for (var i = 0; i < fields.length; i++) {
            shift[fields[i].name] = fields[i].value;
        }

        var m = new shifty.models.Shift(shift);

        if (m.isValid()) {
            this.shifts.add(m);
            this.render();
        } else {
            console.log(m.validationError);
        }

        return false;
    },

    editShift: function(e) {
        var $el = $(e.target), i = $el.data("index"), m = this.shifts.at(i);

        var $form = this.$el.find("form.shift-form");

        for (var key in m.attributes) {
            $form.find("input[name="+key+"]").val(m.get(key));
        }

        m.destroy();

        $el.remove();
    },

    comment: function(e) {
        this.model.set("comment", e.target.value);
    },

    save: function() {
        var shifts =  this.shifts.toJSON();

        // Get the year, month and date
        var date = this.model.get("date");
        var y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

        for (var i in shifts) {
            var shift = shifts[i];

            // Convert start and stop to date objects
            var start = shift.start.match(/(\d{2}):(\d{2})/);
            var stop = shift.stop.match(/(\d{2}):(\d{2})/);

            var startMin = parseInt(start[1], 10)*60+parseInt(start[2], 10);
            var stopMin = parseInt(stop[1], 10)*60+parseInt(stop[2], 10);

            shift.start = new Date(y,m,d,start[1],start[2]);
            if (startMin < stopMin) {
                shift.stop = new Date(y,m,d,stop[1], stop[2]);
            } else {
                shift.stop = new Date(y,m,d+1,stop[1], stop[2]);
            }
        }

        event.shifts = shifts;

        console.log(event);
    }
});

shifty.views.ShiftList = Backbone.View.extend({
    initialize: function(opts) {
        this.p = opts.parent;
    },

    events: {
        "click .default-shifts": "addDefault",
        "submit .add-shift-box": "addShift"
    },

    render: function() {
        var context = {};
        context.shifts = this.collection.toJSON();

        // Get and render the template
        var html = Handlebars.templates['sidebar.shiftlist'](context);
        this.$el.html(html);
    },

    addDefault: function(d) {
        var shifts = [{
            count: 1,
            shifttype: "Skjenkemester",
            start: "17:00",
            stop: "03:00"
        }, {
            count: 2,
            shifttype: "Barfunk",
            start: "17:30",
            stop: "22:00"
        }, {
            count: 2,
            shifttype: "Barfunk",
            start: "21:30",
            stop: "03:00"
        }, {
            count: 1,
            shifttype: "Vakt",
            start: "17:30",
            stop: "00:00"
        }, {
            count: 1,
            shifttype: "Vakt",
            start: "20:00",
            stop: "03:00"
        }, {
            count: 1,
            shifttype: "DJ",
            start: "17:30",
            stop: "22:00"
        }, {
            count: 1,
            shifttype: "DJ",
            start: "21:30",
            stop: "03:00"
        }];

        for (var i in shifts) {
            this.collection.add(new shifty.models.Shift(shifts[i]));
        }

        this.render();
    },

    addShift: function(e) {
        var $form = $(e.target);
        var fields = $form.serializeArray();
        var shift = {};

        for (var i = 0; i < fields.length; i++) {
            shift[fields[i].name] = fields[i].value;
        }

        var m = new shifty.models.Shift(shift);

        if (m.isValid()) {
            this.collection.add(m);
            this.render();
        } else {
            console.log(m.validationError);
        }

        return false;
    }
});
