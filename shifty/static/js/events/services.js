angular.module('cyb.shifty').factory('EventService', function ($resource) {
    return $resource('rest/event/:id/', {
        id: '@id'
    }, {
        query: {
            // no pagination
            isArray: true
        }
    });
});

angular.module('cyb.shifty').factory('ShiftsReportService', function ($resource) {
    return $resource('rest/shift_end_report/');
});