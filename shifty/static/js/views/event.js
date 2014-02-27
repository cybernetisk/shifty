shifty.views.Event = Backbone.View.extend({
    events: {
    },

    initialize: function(el) {
    	
    },

    render: function() {
    	columned = new shifty.views.EventColumned({model: this.model});
    	columned.parentView = new shifty.views.Events();
        this.$el.html(columned.render());
        return this.el;
    }
});