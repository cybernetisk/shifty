shifty.views.Events = Backbone.View.extend({
    el: '#events',

    events: {
    },

    initialize: function(el) {
        this.eventViews = [];
        this.limit = 5;
        this.offset = 1;
    },

    render: function() {      
        $.ajax({url: "/rest/event/?format=json&page=" + offset + "&page_size=" + limit, dataType: 'json'})
            .done(function(data) {
                var events = data.results;

                $.each(events, function(i, ev)
                {
                    var event = new shifty.views.Event({
                        el: this.$el.find(".popout-content"),
                        model: new shifty.models.Event({date: new Date()})
                    });

                    event.render();
                    this.eventViews.push(event);

                });
            })
            .fail(function() {
                alert( "Error: Could not load events" );
            });
    }
});

shifty.views.Event = Backbone.View.extend({
    el: $('<div class="event"></div>'),

    events: {
    },

    initialize: function(el) {
        this.shiftViews = [];
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