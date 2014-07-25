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
            errors.start = "Må være på formatet HH:MM";

        if (!errors.stop && attrs.stop && !attrs.stop.match(/(0[0-9]|1[0-9]|2[0-3])([:\.][0-5][0-9])/))
            errors.stop = "Må være på formatet HH:MM";

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

shifty.collections.Shift = Backbone.Collection.extend({
    model: shifty.models.Shift,
    url: function() {
        return '/rest/shift/';
    },

    /**
     * Sort function to sort shifts by its shift type
     */
    comparator: function(left, right)
    {
        // Workaround for shifts without shift type
        try {
            return right.get('shift_type').title - left.get('shift_type').title;
        } catch (e) {
            return 0;
        }
    }
});

shifty.models.Event = Backbone.Model.extend({
    urlRoot: "/rest/event/",
    initialize: function(attributes) {
        if (attributes && attributes.shifts) {
            this.shifts = new shifty.collections.Shift(attributes.shifts);
        } else if(attributes.id == undefined) {
            this.shifts = new shifty.collections.Shift();
        }
    },

    getResponsible: function()
    {
        var sm = this.shifts.find(function(item) {
            return item.attributes.shift_type.id == 1;
        });
        console.log(sm);

        if(sm.attributes.volunteer !== null){
            return {email: sm.attributes.volunteer.email, firstname: sm.attributes.volunteer.first_name, 
                lastname: sm.attributes.volunteer.last_name, phone: "41907306"};
        }else{
            return null;
        }
    }

});

shifty.collections.Events = Backbone.Collection.extend({
    model: shifty.models.Event,
    page: 1,
    url: function() {
        // TODO: use https://github.com/backbone-paginator/backbone.paginator ?
        // TODO: handle 404 if page not found
        return '/rest/event/';
    },
    parse: function(data) {
        return data.results;
    }
});
