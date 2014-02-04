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
            model: new shifty.models.Event({
                start: new Date()
            })
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
        "keyup #event-comment": "comment",
        "keyup #event-title": "title"
    },

    initialize: function(){
        this.shifts = new shifty.collections.Shift();
    },

    render: function(){
        var context = this.model.toJSON();
        context.shifts = this.shifts.toJSON();

        console.log(context);

        // Get and render the template
        this.el.innerHTML = Handlebars.templates['sidebar.bar'](context);

        var shiftList = new shifty.views.ShiftList({
            el: this.$el.find(".shifts"),
            collection: this.shifts,
            parent: this
        });
        shiftList.render();

        var d = this.model.get("start");

        // Initialize the datepicker
        this.$el.find(".datepicker").datepicker();

        // Set the selected date
        this.$el.find(".selected-date").html(d.getDate() + ". "+months[d.getMonth()]+" "+d.getFullYear());

        return this.el;
    },

    resizeDate: function(e) {
        this.$el.find("#sidebar-bar-date").css({height: 73+$(e.target).height()});
    },

    selectedDate: function(e, d) {
        this.model.set({start: d});

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
            var start = shift.get("start").match(/(\d{2}):(\d{2})/);
            var stop = shift.get("stop").match(/(\d{2}):(\d{2})/);

            var startMin = parseInt(start[1], 10)*60+parseInt(start[2], 10);
            var stopMin = parseInt(stop[1], 10)*60+parseInt(stop[2], 10);

            shift.set("start", new Date(y,m,d,start[1],start[2]));
            if (startMin < stopMin) {
                shift.set("stop", new Date(y,m,d,stop[1], stop[2]));
            } else {
                shift.set("stop", new Date(y,m,d+1,stop[1], stop[2]));
            }

            shift.set("event_id", this.model.get("id"));

            for (var j = 0; j < shift.get("count"); j++) {
                shifts.push(shift.toJSON());
            }
        }

        console.log(this.model.toJSON(), shifts);
        /*
        var _this = this;
        var defer = this.model.save();
        defer.done(function(a,b,c) {
            console.log(_this.model.toJSON());
        }).fail(function(a,b,c) {
            console.log(_this.model.toJSON());
            console.log(a.responseText,b,c);
        });
        */
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
        console.log(this);
        var context = {};
        context.shifts = this.collection.toJSON();

        // Get and render the template
        this.el.innerHTML = Handlebars.templates['sidebar.shiftlist'](context);

        return this.el;
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
    },

    addShift: function(e) {
        e.preventDefault();

        var $form = $(e.target);
        var fields = $form.serializeArray();
        var shift = {};

        for (var i = 0; i < fields.length; i++) {
            shift[fields[i].name] = fields[i].value;
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