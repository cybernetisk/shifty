shifty.views.Dropdown = Backbone.View.extend({
    initialize: function() {
        this.template = Handlebars.templates["dropdown.shifttype"];
    },

    events: {
        "keydown": "keydown",
        "focus": "showDropdown",
        "blur": "hideDropdown"
    },

    render: function() {
        this.el.setAttribute("tabindex", 0);

        this.el.innerHTML = this.template({
            shifttypes: [
                {id: 0, name: "Skjenkemester"},
                {id: 1, name: "Barfunk"},
                {id: 2, name: "vakt"},
                {id: 3, name: "DJ"}
            ]
        });
    },

    keydown: function(e) {
        console.log(e);
        switch (e.keyCode) {
            case 13:
                console.log("Enter");
                e.preventDefault();
                break;
            case 38:
                console.log("Up");
                e.preventDefault();
                break;
            case 40:
                console.log("Down");
                e.preventDefault();
                break;
        }
    },

    showDropdown: function(e) {
        this.$(".dropdown-list").css({display: "block"});
    },

    hideDropdown: function(e) {
        this.$(".dropdown-list").css({display: "none"});
    }
});
