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
        });
        $http.get('/rest/event/').success(function(result){
            $scope.events = result
        });

        $scope.refresh_event = function()
        {
            $http.get('/rest/yourshift/').success(function(result){
            $scope.shifts = result
            });
            /*EventService.query(function(res) {
                $scope.events = res;

            });*/
        }

        $scope.untake_shift = function(shift)
        {
            $http.post('/free_shift', {shift_id:shift['id']})
                .success(function(result){
                    $scope.refresh_event();
                });
        }
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

        $scope.is_staff = AuthService.isStaff();
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

    module.controller('OverviewController', function ($scope, $stateParams, EventService, ShiftsReportService, AuthService) {
        $scope.is_staff = AuthService.isStaff();

        var eventLoader = function () {
            EventService.get({id: $stateParams.eventId}, function(res) {
                $scope.event = res;
                // Prefill data
                $scope.event.shifts.forEach(function(item) {
                    if (item.end_report) { // Use previous end reports data when available
                        item.corrected_hours = parseInt(item.end_report.corrected_hours);
                        item.verified = item.end_report.verified;
                    } else { // Use planned length and confirm everything as the most probable scenario easy
                        item.verified = true;
                        item.corrected_hours = item.duration;
                    }
                });
            });
        }
        eventLoader();

        // Stop further processing after loading event info
        if (!$scope.is_staff) {
            return;
        }

        $scope.confirm_shifts = function(event)
        {
            // Gather the data from the model to formulate separate REST query
            var output = [];
            $scope.event.shifts.forEach(function(item) {
                if (item.volunteer) {
                    output.push({
                        shift: item.id,
                        verified: item.verified,
                        corrected_hours: item.corrected_hours
                    });
                }
            });
            // Send data
            ShiftsReportService.save(output, function() {
                // Reload saved data
                eventLoader();
            });
        };

        $scope.handle_response = function(){
            EventService.query(function(res) {
                $scope.events = res;
            });
        }
    });
})();