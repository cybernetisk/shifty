shifty.collections.Shifts = Backbone.Collection.extend({
    model: shifty.models.Shift,

    initialize: function(opts) {
        opts = opts || {};

        if (opts.free) {
            this.url = "/rest/free_shifts/";
        } else {
            this.url = "/rest/shift/";
        }
    },

    parse: function(data) {
        return data.results;
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
