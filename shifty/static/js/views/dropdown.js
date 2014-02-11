shifty.views.Dropdown = Backbone.View.extend({
    className: "dropdown",

    initialize: function() {
        this.template = Handlebars.templates["dropdown.shifttype"];
    },

    events: {
        "keydown": "keydown",
        "focus": "showDropdown",
        "blur": "hideDropdown",
        "click li": "clickSelect"
    },

    state: {
        el: undefined,
        selected: undefined
    },

    shifttypes: [
        {id: 0, name: "Skjenkemester"},
        {id: 1, name: "Barfunk"},
        {id: 2, name: "vakt"},
        {id: 3, name: "DJ"}
    ],

    render: function() {
        this.el.setAttribute("tabindex", 0);

        this.el.innerHTML = this.template({
            shifttypes: this.shifttypes,
            name: this.options.name
        });

        this.display = this.$("p")[0];
        this.input = this.$("input")[0];
        this.el.setAttribute("tabindex", 0);

        return this.el;
    },

    keydown: function(e) {
        switch (e.keyCode) {
            case 13:
                this.select();
                e.preventDefault();
                break;
            case 38:
                this.up();
                e.preventDefault();
                break;
            case 40:
                this.down();
                e.preventDefault();
                break;
        }
    },

    down: function() {
        if (!this.state.el) {
            this.state.el = this.$(".dropdown-list li")[0];
            this.state.selected = this.state.el.getAttribute("data-id");
        } else {
            var prev = this.state.el;
            var next = prev.nextElementSibling;

            prev.classList.remove("selected");

            if (next) {
                this.state.el = next;
                this.state.selected = parseInt(this.state.el.getAttribute("data-id"), 10);
            }
        }

        this.state.el.classList.add("selected");
        this.display.textContent = this.shifttypes[this.state.selected].name;
        this.input.value = this.state.selected;
    },

    up: function() {
        if (!this.state.el) {
            this.state.el = this.$(".dropdown-list li")[0];
            this.state.selected = this.state.el.getAttribute("data-id");
        } else {
            var prev = this.state.el;
            var next = prev.previousElementSibling;

            prev.classList.remove("selected");

            if (next) {
                this.state.el = next;
                this.state.selected = parseInt(this.state.el.getAttribute("data-id"), 10);
            }
        }

        this.state.el.classList.add("selected");
        this.display.textContent = this.shifttypes[this.state.selected].name;
        this.input.value = this.state.selected;
    },

    clickSelect: function(e) {
        this.$("li.selected").removeClass("selected");
        this.state.el = e.target;
        this.state.el.classList.add("selected");
        this.state.selected = this.state.el.getAttribute("data-id");

        this.input.value = this.state.selected;

        this.select();
    },

    select: function() {
        this.hideDropdown();
        this.display.textContent = this.shifttypes[this.state.selected].name;
        this.$el.next("input").focus();
    },

    reset: function() {
        this.display.textContent = "shifttype";

        if (this.state.el) {
            this.state.el.classList.remove("selected");
        }
        this.state.el = undefined;
        this.state.selected = undefined;
    },

    showDropdown: function(e) {
        this.$(".dropdown-list").css({display: "block"});
    },

    hideDropdown: function(e) {
        this.$(".dropdown-list").css({display: "none"});
    }
});
