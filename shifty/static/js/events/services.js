angular.module('cyb.shifty').factory('EventService', function ($resource) {
    return $resource('rest/event', {
        id: '@id'
    }, {
        query: {
            // no pagination
            isArray: true
        }
    });
});