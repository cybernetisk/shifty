angular.module('cyb.shifty').factory('UserService', function ($resource) {
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



angular.module('cyb.shifty').factory('AuthService', function($http) {
  var currentUser = {'username':'admin', 'id':1};

  return {
    isLoggedIn: function() { currentUser != undefined },
    currentUser: function() { return currentUser; }
    isStaff: function() { return currentUser['is_staff']; }
  };
});