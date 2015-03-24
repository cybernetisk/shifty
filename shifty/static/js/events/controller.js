(function() {
    'use strict';

    var module = angular.module('cyb.shifty');

    module.config(function ($stateProvider) {
        $stateProvider.state('event', {
            url: '/event',
            templateUrl: 'static/partial/events.html',
            controller: 'EventController as events'
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
})();