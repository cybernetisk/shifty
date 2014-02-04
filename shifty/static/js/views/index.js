shifty.views.Index = Backbone.View.extend({
    events: {
    },

    initialize: function(el) {
        
    },

    render: function() {
        this.el.innerHTML = Handlebars.templates.index();
        return this.el;
    }
});