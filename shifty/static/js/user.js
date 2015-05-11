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



angular.module('cyb.shifty').factory('AuthService', function($http, localStorageService) {
  var currentUser = localStorageService.get('user');// {'username':'admin', 'id':1, 'is_staff':true};
  if(currentUser == null)
    currentUser = {};
    if(currentUser == {})
    {
        $http.get('/whoami').success(function(user){
            localStorageService.set('user', user);
            window.location.reload();
        });
    }
  return {

    isLoggedIn: function() { currentUser != undefined },
    currentUser: function() { return currentUser; },
    isStaff: function() { return currentUser['admin']; },
    logout: function(){
        localStorageService.set('user', null);
    }
  };
});