shifty.models.NewUser = Backbone.Model.extend({
    urlRoot: "/create_shift_user",

    initialize: function(attrs) {
        
    },

    validate: function(attrs, options) {
        var required = ["username", "firstname", "lastname"]
        var errors = [];

        for (var i in attrs) {
            if (attrs[i] === "") errors[i] = "Må være satt";
        }

        if (errors.length > 0) return errors;
    }
});