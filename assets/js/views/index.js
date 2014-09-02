shifty.views.Index = Backbone.View.extend({
    events: {
    },

    initialize: function(options) {
        this.urgent = options.urgent;
    },

    render: function() {
        this.el.innerHTML = shifty.template("index")({ 
            upcomingEvents: this.collection.toJSON(), 
            urgent: this.urgent.toJSON(),
            status: this.count,
            best: this.best
        });

        return this.el;
    }
});
