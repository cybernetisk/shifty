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

        if(sm != null && sm.attributes.volunteer != null) {
            info = {email: sm.attributes.volunteer.email, firstname: sm.attributes.volunteer.first_name, 
                lastname: sm.attributes.volunteer.last_name, 
                username: sm.attributes.volunteer.username};
            if(sm.attributes.volunteer.contactinfo != null) {
                info.phone = sm.attributes.volunteer.contactinfo.phone;
            }
            return info;
        }else{
            return null;
        }
    }

});
