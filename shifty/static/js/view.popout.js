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
            el: this.$el.find(".popout-content")
        });
        bar.render();
        this.views.push(bar);
    },

    show: function() {
        this.$el.css({right:0});
    },

    hide: function() {
        this.$el.css({right:-300});
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
        "click .selected-date": "toggleDatepicker",
        "click .default-shifts": "insertDefaults",
        "click .shift": "editShift",
        "submit .shift-form": "addShift"
    },

    model: {
        date: new Date(),
        shifts: []
    },

    initialize: function(){
    },

    render: function(){
        // Get and render the template
        var html = Handlebars.templates['sidebar.bar'](this.model);
        this.$el.html(html);

        // Initialize the datepicker
        this.$el.find(".datepicker").datepicker();

        // Set the selected date
        this.$el.find(".selected-date").html(this.model.date.getDate() + ". "+months[this.model.date.getMonth()]+" "+this.model.date.getFullYear());
    },

    resizeDate: function(e) {
        this.$el.find("#sidebar-bar-date").css({height: 73+$(e.target).height()});
    },

    selectedDate: function(e, date) {
        this.model.date = date;

        this.$el.find(".selected-date").html(date.getDate() + ". "+months[date.getMonth()]+" "+date.getFullYear());

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
        return false;
    },

    addShift: function(e) {
        var $form = $(e.target);
        var fields = $form.serializeArray();
        var shift = {};

        shift.id = this.model.shifts.length;

        for (var i = 0; i < fields.length; i++) {
            shift[fields[i].name] = fields[i].value;
        }

        this.model.shifts[shift.id] = shift;

        this.render();

        return false;
    },

    editShift: function(e) {
        var $el = $(e.target), i = $el.data("index");

        m = this.model.shifts[i];

        var $form = this.$el.find("form.shift-form");

        for (var key in m) {
            $form.find("input[name="+key+"]").val(m[key]);
        }

        $form.prepend('<input name="id" type="hidden" value="'+m.id+'" />');

        $el.remove();
    }
});
