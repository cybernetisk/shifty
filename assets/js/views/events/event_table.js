shifty.views.EventTable = Backbone.View.extend({
    parentView: null,
    events: {
        'click .shift': 'takeShift'
    },

    render: function()
    {
        return this.$el.html(shifty.template("event_list")(this.model.toJSON()));
    },

    takeShift: function(ev)
    {
        // find the shift element
        var obj = $(ev.currentTarget);
        if (!obj.hasClass("shift")) obj = obj.parent(".shift");

        // find data for this block
        var shift_id = obj.attr('id').substring(6);
        console.log("takeShift", this);

        var shift = this.model.shifts.get(shift_id);
        var data = shift.attributes;
        var twinsData = {
            'event': this.model.attributes,
            'shift': data,
            'cssClass': "shift_type_" + data.shift_type.id,
            'twins': [data],
            'shiftsCollection': new shifty.collections.shifts([shift]),
            'twinsCount': 1,
            'hasTwins': false
        };

        // generate take shift-box
        twinsData = $.extend(twinsData, {'event': this.model.toJSON()});
        this.parentView.takeShiftBox(obj, twinsData);
    }
});
