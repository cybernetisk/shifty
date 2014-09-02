shifty.views.Dropdown = Backbone.View.extend({
    className: "dropdown",

    initialize: function(options) {
        options = options || {};
        this.name = options.name || "";
        this.template = shifty.template("dropdown.shifttype");
    },

    events: {
        "keydown": "keydown",
        "focus": "showDropdown",
        "blur": "hideDropdown",
        "click li": "clickSelect",
        "click p": "showDropdown",
    },

    state: {
        el: undefined,
        selected: undefined
    },

    render: function() {
        // Render the dropdown tempalte
        this.el.innerHTML = this.template({
            shifttypes: shifty.shiftTypes.toJSON(),
            name: this.name
        });

        // Cache some other parts
        this.display = this.el.querySelector("p");
        this.input   = this.el.querySelector("input");
        this.list    = this.el.querySelector("ul");
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
            // No element is selected, select first
            this.state.el = this.list.querySelector("li");
            this.state.selected = this.state.el.getAttribute("data-id");
        } else {
            // Select the next element to the current one
            var prev = this.state.el;
            var next = prev.nextElementSibling;


            if (next) {
                prev.classList.remove("selected");
                this.state.el = next;
                this.state.selected = parseInt(this.state.el.getAttribute("data-id"), 10);
            }
        }

        this.state.el.classList.add("selected");
        this.display.textContent = shifty.shiftTypes.get(this.state.selected).get("title");
        this.input.value = this.state.selected;
    },

    up: function() {
        if (!this.state.el) {
            this.state.el = this.list.querySelector("li");
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
        var cur;
        // Remove any previously selected element
        cur = this.el.querySelector("li.selected");
        if (cur)
            cur.classList.remove("selected");

        this.input.value = e.target.getAttribute('data-id');

        this.select();
    },

    select: function() {
        this.display.textContent = this.shifttypes[this.input.value].name;
        this.$el.parent().next("input").focus();
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
        this.list.classList.add("open");
    },

    hideDropdown: function(e) {
        this.list.classList.remove("open");
    },
});
