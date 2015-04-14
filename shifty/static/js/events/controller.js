(function() {
    'use strict';

    var module = angular.module('cyb.shifty');

    module.config(function ($stateProvider) {
        $stateProvider.state('event', {
            url: '',
            templateUrl: 'static/partial/events.html',
            controller: 'EventController as events'
        });
        $stateProvider.state('overview', {
            url: '/overview/:eventId',
            templateUrl: 'static/partial/overview.html',
            controller: 'OverviewController as events'
        });
        $stateProvider.state('yourshifts', {
            url: '/yourshifts',
            templateUrl: 'static/partial/yourshifts.html',
            controller: 'YourshiftController as yourshift'
        });
    });

    module.controller('YourshiftController', function ($scope, $http) {
        $http.get('/rest/yourshift/').success(function(result){
            $scope.shifts = result
        })
    });


function tag_collisions(events, user)
{
    var shifts = Array();
    var yourshifts = Array();

    events.forEach(function(event){
        event.shifts.forEach(function(shift){
            shifts.push(shift);
            if(shift['user']['id'] == user['id'])
                yourshifts.push(shift);
        });
    });

}



module.controller('EventEditController', function ($scope, $stateParams, $http) {
    
    
    
});


    module.controller('EventController', function ($scope, $http, EventService, ShiftService, AuthService) {
        $scope.current_user = AuthService.currentUser();

        $scope.refresh_event = function()
        {
            EventService.query(function(res) {
                $scope.events = res;

            });
        }

        $scope.refresh_event();

        $scope.show_taken = false;

        $scope.take_shift = function(shift)
        {
            // var req = ShiftService.take_shift(shift);
            // req.success($scope.handle_response);
            $http.post('/take_shift', {shift_id:shift['id'], username:shift['new_volunteer']})
                .success(function(result){
                    if(result['status'] == 'collides')
                    {
                        shift['fail_reason'] = 'Collides with ' + result['desc'];
                    }
                    else if(result['status'] == 'ok')
                    {
                        $scope.refresh_event();
                    }
                })
        }

        $scope.thefilter = function(x)
        {
            
            if($scope.show_taken || x['volunteer'] == null)
                return x;
            return false;
        }

        $scope.remove_volunteer = function(shift)
        {
            $http.post('/free_shift', {shift_id:shift['id']})
                .success(function(result){
                    $scope.refresh_event();
                });
        }

        $scope.handle_response = function(){
            EventService.query(function(res) {
                $scope.events = res;
                $scope.events.forEach(function(obj){
                    obj['_volunteer'] = angular.copy(obj['volunteer']);
                });
            });
        }
    });

    module.controller('OverviewController', function ($scope, $stateParams, EventService, ShiftsReportService) {
        console.log($stateParams.eventId);
        EventService.get({id: $stateParams.eventId}, function(res) {
            $scope.event = res;
            // Prefill data (confirm everything in planned length to make the most probable scenario easy)
            $scope.event.shifts.forEach(function(item) {
                item.verified =  true;
                item.corrected_hours = item.duration;
            });
        });

        $scope.confirm_shifts = function(event)
        {
            // Gather the data from the model to formulate separate REST query
            var output = [];
            $scope.event.shifts.forEach(function(item) {
                output.push({
                    shift: item.id,
                    verified: item.verified,
                    corrected_hours: item.corrected_hours
                });
            });
            // Send data
            console.log(output);
            ShiftsReportService.save(output);
        };

        $scope.handle_response = function(){
            EventService.query(function(res) {
                $scope.events = res;
            });
        }
    });
})();