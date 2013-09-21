shifty.models.Shift = Backbone.Model.extend({
    validate: function(attrs, options) {
        var required = ["count", "shifttype", "start", "stop"];
        var errors = [];

        for (var i in attrs) {
            if (attrs[i] === "") errors.push({i: "Må være satt"});
        }

        if (!errors.start && attrs.start && !attrs.start.match(/(0[0-9]|1[0-9]|2[0-3])([:\.][0-5][0-9])/))
            errors.start = "Må være på formatet HH:MM";

        if (!errors.stop && attrs.stop && !attrs.stop.match(/(0[0-9]|1[0-9]|2[0-3])([:\.][0-5][0-9])/))
            errors.stop = "Må være på formatet HH:MM";

        if (errors.length > 0) return errors;
    }
});

shifty.collections.Shift = Backbone.Collection.extend({
    model: shifty.models.Shift
});

shifty.models.Event = Backbone.Model.extend({
});

