(function() {
    function lastMonday(date) {
        var d = new Date(date);
        var day = d.getDay();
        var diff = d.getDate() - day + (day === 0 ? -6 : 1);
        d.setDate(diff);

        return d;
    }

    function nextSunday(date) {
        var d = new Date(date);
        var day = d.getDay();
        var diff = d.getDate() + 7 - (day === 0 ? 7 : day);
        d.setDate(diff);

        return d;
    }

    function isToday(date) {
        var d = new Date();
        return date.getDate() == d.getDate() &&
            date.getMonth() == d.getMonth() &&
            date.getFullYear() == d.getFullYear();
    };

    // Month names
    var months = ["januar","februar", "mars", "april", "mai", "juni",
        "juli", "august", "september", "oktober", "november", "desember"];

    var days = ["man", "tir", "ons", "tor", "fre", "lør", "søn"];

    shifty.views.DatePicker = Backbone.View.extend({
        tagName: "table",
        className: "datepicker",

        initialize: function(options) {
            options = options || {};
            this.body = document.createElement("tbody");
            this.month = document.createElement("th");
            this.month.setAttribute("colspan", 5);
            this.date = options.date || new Date();
        },

        events: {
            "click td": "selectDate",
            "click .next": "nextMonth",
            "click .prev": "prevMonth"
        },

        render: function() {
            // Initialize header
            var row1 = document.createElement("tr");
            var row2 = document.createElement("tr");
            var head = document.createElement("thead");
            var prev = document.createElement("th");
            var next = document.createElement("th");

            // Add rows to header
            head.appendChild(row1);
            head.appendChild(row2);

            // Create first header row
            prev.classList.add("prev");
            prev.textContent = "<";
            row1.appendChild(prev);
            row1.appendChild(this.month);
            next.classList.add("next");
            next.textContent = ">";
            row1.appendChild(next);

            // Create second header row
            row2.classList.add("days");
            for (var i = 0; i < 7; i++) {
                var td = document.createElement("th");
                td.textContent = days[i];
                row2.appendChild(td);
                row2.appendChild(td);
            }

            this.renderMonth();

            // Content to the table
            this.el.appendChild(head);
            this.el.appendChild(this.body);

            return this.el;
        },

        setDate: function(date) {
            this.date = new Date(date);
            this.renderMonth();
        },

        renderMonth: function() {
            // Remove all existing elements from the body
            var last = this.body.lastChild;
            for (;last;last = this.body.lastChild) {
                this.body.removeChild(last);
            }

            // Get the beginning of the month
            var d0 = new Date(this.date);
            d0.setMilliseconds(0);
            d0.setSeconds(0);
            d0.setMinutes(0);
            d0.setHours(0);
            d0.setDate(1);

            // Get the end of the month
            var d1 = new Date(d0);
            d1.setMonth(d1.getMonth()+1);
            d1.setDate(0);

            // Get start and stop of month
            var start = lastMonday(d0);
            var stop = nextSunday(d1);

            while (start <= stop) {
                // Create a new row for each week and append to view
                var row = document.createElement("tr");
                for (var i = 0; i < 7; i++) {
                    var td = document.createElement("td");

                    // Configure element
                    td.textContent = start.getDate();
                    td.__date__ = new Date(start);

                    if (start.getMonth() != d0.getMonth()) {
                        td.classList.add("other");
                    }

                    row.appendChild(td);

                    // Next day please
                    start.setDate(start.getDate()+1);
                }

                // Add the row
                this.body.appendChild(row);
            }

            this.month.textContent = months[d0.getMonth()]+" "+d0.getFullYear();

            // The element might have been resized
            this.trigger("resize");
        },

        selectDate: function(e) {
            var d = e.target.__date__;

            if (d.getMonth() != this.date.getMonth()) {
                this.date = new Date(d);
                this.renderMonth();
            }

            this.trigger("change", new Date(d));
        },

        nextMonth: function() {
            this.date.setMonth(this.date.getMonth()+1);
            this.renderMonth();
        },

        prevMonth: function() {
            this.date.setMonth(this.date.getMonth()-1);
            this.renderMonth();
        }
    });
})();
