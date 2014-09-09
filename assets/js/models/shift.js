shifty.models.Shift = Backbone.Model.extend({
    urlRoot: "/rest/shift/",

    initialize: function(attrs) {
    },

    validate: function(attrs, options) {
        var required = ["count", "shifttype", "start", "stop", "title"];
        var errors = [];

        for (var i in attrs) {
            if (attrs[i] === "") errors.push({i: "Må være satt"});
        }

        if (!errors.start && attrs.start && !attrs.start.match(/(0[0-9]|1[0-9]|2[0-3])([:\.][0-5][0-9])/))
            errors.start = "Må være på formatet HH eller HH:MM";

        if (!errors.stop && attrs.stop && !attrs.stop.match(/(0[0-9]|1[0-9]|2[0-3])([:\.][0-5][0-9])/))
            errors.stop = "Må være på formatet HH eller HH:MM";

        if (errors.length > 0) return errors;
    },

    setDate: function(date) {
        // Update start and stop to be static dates, not relative times
    },

    /**
     * Check if shift is twin with another
     */
    isTwin: function(other)
    {
        return (this.attributes.shift_type.id == other.attributes.shift_type.id
             && this.attributes.start == other.attributes.start
             && this.attributes.stop == other.attributes.stop);
    }
});
