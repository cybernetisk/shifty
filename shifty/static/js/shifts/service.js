angular.module('cyb.shifty').factory('ShiftService', function ($resource, $http) {
    var obj = $resource('rest/shift/:id/', {'id':'@id'},
        {take: {method:'PATCH'}}


        );

    return obj;
});