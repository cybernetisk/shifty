shifty.models.User = Backbone.Model.extend({
    urlRoot: "/create_shift_user",

    initialize: function(attrs) {
        
    },

    login: function(username, password, success, failed){
        console.log(username);
        var tmp = $.post('/login', {'username':username, 'password':password});
        tmp.success(function(res, response){
            csrftoken = res['csrf'];
            console.log(csrftoken);
            $.ajaxSetup({
                headers: { 'X-CSRFToken': csrftoken }
            });
            shifty.state.user = new shifty.models.User();
            success();
        });
        tmp.error(failed);
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