shifty.views.Index = Backbone.View.extend({
    events: {
    },

    initialize: function(options) {
        this.count = options.shift_counts.responseJSON;
    },

    render: function() {
    	freeSm = this.count.sm.free;
        freeBar = this.count.bar.free;
        freeGuard = this.count.guard.free;
        freeDj = this.count.dj.free;

        this.el.innerHTML = Handlebars.templates.index({ 
        						upcomingEvents: this.collection.toJSON(), 
        						smCount: this.count.sm,
        						barCount: this.count.bar,
        						guardCount: this.count.guard,
        						djCount: this.count.dj
        					});
        return this.el;
    }
});