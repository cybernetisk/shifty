shifty.views.Popout = Backbone.View.extend({
    id: 'popout',
    className: 'popout',

    events: {
        "click .close-button": "hide"
    },

    initialize: function(el) {
        $("body").append(this.el);

        this.views = [];
    },

    render: function() {
        this.el.innerHTML = shifty.template("popout")({});

        // Render the temo
        var bar = new shifty.views.BarShifts({
            parent: this,
            el: this.el.querySelector(".popout-content"),
            model: new shifty.models.Event({
                start: new Date()
            })
        });
        bar.render();
        this.views.push(bar);

        return this;
    },

    show: function() {
        this.el.classList.add("open");
    },

    hide: function() {
        this.el.classList.remove("open");
    }
});

shifty.views.BarShifts = Backbone.View.extend({
    className: 'popout',

    state: {
        datepicker: true
    },

    months: ["januar","februar", "mars", "april", "mai", "juni",
        "juli", "august", "september", "oktober", "november", "desember"],

    events: {
        "click .date-header": "toggleDatepicker",
        "click #save-shifts": "save",
        "keyup #event-comment": "comment",
        "keyup #event-title": "title"
    },

    initialize: function(opts){
        this.shifts = new shifty.collections.Shifts();
        this.datepicker = new shifty.views.DatePicker();

        this.p = opts.parent;

        this.listenTo(this.datepicker, "resize", this.resizeDate);
        this.listenTo(this.datepicker, "change", this.selectedDate);
    },

    render: function(){
        var context = this.model.toJSON();
        context.shifts = this.shifts.toJSON();

        // Get and render the template
        this.el.innerHTML = shifty.template('sidebar.bar')(context);

        var shiftList = new shifty.views.ShiftList({
            el: this.el.querySelector(".shifts"),
            collection: this.shifts,
            parent: this
        });
        shiftList.render();

        var d = this.model.get("start");

        // Initialize the datepicker
        this.$el.find(".datepicker").append(this.datepicker.render());

        // Set the selected date
        this.$el.find(".selected-date").html(d.getDate() + ". "+this.months[d.getMonth()]+" "+d.getFullYear());

        this.datepicker.setDate(d);
        this.resizeDate();

        return this.el;
    },

    resizeDate: function() {
        if (!this.state.datepicker) {
            this.$el.find("#sidebar-bar-date").css({height: 60});
            this.$el.find(".datepicker").css({visibility: "hidden", opacity: 0});
        } else {
            this.$el.find("#sidebar-bar-date").css({height: 73+this.$el.find(".datepicker").height()});
            this.$el.find(".datepicker").css({visibility: "visible", opacity: 1});
        }
    },

    selectedDate: function(d) {
        this.model.set({start: d});

        this.$el.find(".selected-date").html(d.getDate() + ". "+this.months[d.getMonth()]+" "+d.getFullYear());

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

    comment: function(e) {
        this.model.set("comment", e.target.value);
    },

    title: function(e) {
        this.model.set("title", e.target.value);
    },

    save: function() {
        var shifts = [];

        // Get the year, month and date
        var date = this.model.get("start");
        var y = date.getFullYear(), m = date.getMonth(), d = date.getDate();

        for (var i = 0; i < this.shifts.size(); i++) {
            var shift = this.shifts.at(i);

            // Convert start and stop to date objects
            var start = shift.get("start");
            var stop = shift.get("stop");
            var startMin, stopMin;

            if (!start.getMonth) {
                start = start.match(/(\d{2})(:(\d{2}))?/);

                if(!start[3])
                  start[3] = "00";

                startMin = parseInt(start[1], 10)*60+parseInt(start[3], 10);
                shift.set("start", new Date(y,m,d,start[1],start[3]));
            }
            if (!stop.getMonth) {
                stop = stop.match(/(\d{2})(:(\d{2}))?/);

                if(!stop[3])
                  stop[3] = "00";

                stopMin = parseInt(stop[1], 10)*60+parseInt(stop[3], 10);

                if (startMin < stopMin) {
                    shift.set("stop", new Date(y, m, d, stop[1], stop[3]));
                } else {
                    shift.set("stop", new Date(y, m, d+1 ,stop[1], stop[3]));
                }
            }

            shift.set("event_id", this.model.get("id"));

            var s = shift.toJSON();
            delete s.count;

            console.log(s);

            for (var j = 0; j < shift.get("count"); j++) {
                shifts.push(s);
            }
        }

        this.model.set("description", this.$("#event-comment").val());
        this.model.set("shifts", shifts);

        this.model.save().done(function() {
            this.model = new shifty.models.Event({
                start: new Date()
            });
            this.shifts = new shifty.collections.Shifts();
            this.p.hide();
            this.render();
        }.bind(this)).fail(function() {
            console.log(arguments);
        }.bind(this));
    }
});

shifty.views.ShiftList = Backbone.View.extend({
    initialize: function(opts) {
        this.p = opts.parent;

        this.listenTo(this.collection, "add", this.render);
        this.listenTo(this.collection, "remove", this.render);
    },

    events: {
        "click .default-shifts": "addDefault",
        "submit .add-shift-box": "addShift",
        "keydown .shift": "shiftKeydown"
    },

    render: function() {
        var context = {};
        context.shifts = this.collection.toJSON();

        // Get and render the template
        this.el.innerHTML = shifty.template('sidebar.shiftlist')(context);

        if (!this.dropdown) {
            this.dropdown = new shifty.views.Dropdown({
                name: "shift_type_id"
            });

            this.dropdown.render();
        } else {
            this.dropdown.reset();
        }

        this.$(".shifttype").append(this.dropdown.$el);

        return this.el;
    },

    addDefault: function(d) {
        var shifts = [{
            count: 1,
            shift_type_id: 1,
            start: "17:00",
            stop: "03:00"
        }, {
            count: 2,
            shift_type_id: 2,
            start: "17:30",
            stop: "22:00"
        }, {
            count: 2,
            shift_type_id: 2,
            start: "21:30",
            stop: "03:00"
        }, {
            count: 1,
            shift_type_id: 3,
            start: "17:30",
            stop: "00:00"
        }, {
            count: 1,
            shift_type_id: 3,
            start: "20:00",
            stop: "03:00"
        }, {
            count: 1,
            shift_type_id: 4,
            start: "17:30",
            stop: "22:00"
        }, {
            count: 1,
            shift_type_id: 4,
            start: "21:30",
            stop: "03:00"
        }];

        for (var i in shifts) {
            this.collection.add(new shifty.models.Shifts(shifts[i]));
        }
    },

    addShift: function(e) {
        e.preventDefault();

        var $form = $(e.target);
        var fields = $form.serializeArray();
        var shift = {};

        for (var i = 0; i < fields.length; i++) {
            var v = fields[i].value;
            if (v.match(/^\d+$/)) {
                v = parseInt(v, 10);
            }
            shift[fields[i].name] = v;
        }

        var m = new shifty.models.Shift(shift);

        if (m.isValid()) {
            this.collection.add(m);
        } else {
            console.log(m.validationError);
        }

        this.$(".count").focus();
    },

    shiftKeydown: function(e) {
        if (e.keyCode == 8) {
            e.preventDefault();

            console.log("Delete shift");
        } else if (e.keyCode == 13) {
            e.preventDefault();

            console.log("Edit shift");
        }
    }
});
