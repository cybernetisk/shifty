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
    var currentUser = localStorageService.get('user');
    var backendUser;

    $http.get('/whoami').success(function(user){
        backendUser = user;
        if (currentUser == null ||  currentUser['id'] != backendUser['id']) {
            localStorageService.set('user', backendUser);
            window.location.reload();
        }
    });

    return {

        isLoggedIn: function() { return currentUser != undefined },
        currentUser: function() { return currentUser; },
        isStaff: function() { return currentUser['admin']; },
        logout: function(){
            localStorageService.set('user', null);
        }
    };
});