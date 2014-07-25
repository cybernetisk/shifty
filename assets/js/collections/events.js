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
