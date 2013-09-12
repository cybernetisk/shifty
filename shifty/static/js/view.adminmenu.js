shifty.views.AdminMenu = Backbone.View.extend({
    el: "#admin-menu",

    events: {
        "click .toggle-button": "toggle",
        "click .bar-button": "bar"
    },

    initialize: function() {
        this.menuOpen = false;
    },

    render: function() {
        var html = Handlebars.templates.adminmenu({});
        this.$el.html(html);

        this.$menuItems = this.$el.find(".menu-items");
        this.$toggleButton = this.$el.find(".toggle-button");
    },

    toggle: function(e) {
        if (this.menuOpen) {
            this.$toggleButton.attr("class", "toggle-button");
            this.$menuItems.css({right:-60});
            this.menuOpen = false;
        } else {
            this.$toggleButton.attr("class", "toggle-button open");
            this.$menuItems.css({right:0});
            this.menuOpen = true;
        }
    },

    bar: function(e) {
        v.show();
    }
});
