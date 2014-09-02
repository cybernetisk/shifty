shifty.collections.ShiftTypes = Backbone.Collection.extend({
    model: shifty.models.ShiftType,

    url: '/rest/shifttype/',

    parse: function(data) {
        return data.results;
    },
});
