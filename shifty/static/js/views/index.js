shifty.views.Index = Backbone.View.extend({
    events: {
    },

    initialize: function(el) {
        
    },

    render: function() {
        this.el.innerHTML = Handlebars.templates.index({ upcomingEvents: this.collection.toJSON() });
        return this.el;
    }
});