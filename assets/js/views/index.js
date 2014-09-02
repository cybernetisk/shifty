shifty.views.Index = Backbone.View.extend({
    events: {
    },

    initialize: function(options) {
        this.count = options.shift_counts;
        this.urgent = options.urgent;
    },

    render: function() {
        this.el.innerHTML = shifty.template("index")({ 
            upcomingEvents: this.collection.toJSON(), 
            urgent: this.urgent.toJSON(),
            status: this.count
        });

        return this.el;
    }
});
