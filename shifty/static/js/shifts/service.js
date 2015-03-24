angular.module('cyb.shifty').factory('ShiftService', function ($resource, $http) {
    var obj = $resource('rest/shift', {
        id: '@id'
    }, {
        query: {
            // no pagination
            isArray: true
        }
    });

    obj.take_shift = function(shift)
    {
        return $http.post('/take_shift', {'shift_id':shift.id});
    }

    obj.untake_shift = function(shift)
    {
        $http.get('/untake_shift/' + shift.id);
    }

    return obj;
});