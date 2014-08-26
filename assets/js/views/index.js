shifty.views.Index = Backbone.View.extend({
    events: {
    },

    initialize: function(options) {
        this.count = options.shift_counts;
        this.urgent = options.urgent;
    },

    render: function() {
        freeSm = this.count.sm.free;
        freeBar = this.count.bar.free;
        freeGuard = this.count.guard.free;
        freeDj = this.count.dj.free;

        console.log(this.urgent.toJSON());

        this.el.innerHTML = shifty.template("index")({ 
            upcomingEvents: this.collection.toJSON(), 
            urgent: this.urgent.toJSON(),
            smCount: this.count.sm,
            barCount: this.count.bar,
            guardCount: this.count.guard,
            djCount: this.count.dj
        });

        return this.el;
    }
});
