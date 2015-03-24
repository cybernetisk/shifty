(function() {
    'use strict';

    var module = angular.module('cyb.shifty');

    module.config(function ($stateProvider) {
        $stateProvider.state('event', {
            url: '/event',
            templateUrl: 'static/partial/events.html',
            controller: 'EventController as events'
        });
        $stateProvider.state('overview', {
            url: '/overview/:eventId',
            templateUrl: 'static/partial/overview.html',
            controller: 'OverviewController as events'
        })
    });

    module.controller('EventController', function ($scope, EventService, ShiftService) {
        EventService.query(function(res) {
            $scope.events = res;
        });

        $scope.take_shift = function(shift)
        {
            var req = ShiftService.take_shift(shift);
            req.success($scope.handle_response);
        }

        $scope.handle_response = function(){
            EventService.query(function(res) {
                $scope.events = res;
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