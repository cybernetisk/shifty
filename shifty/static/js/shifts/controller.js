(function() {
    'use strict';

    var module = angular.module('cyb.shifty');

    module.config(function ($stateProvider) {
        $stateProvider.state('shift', {
            url: '/shift',
            templateUrl: 'static/partial/shifts.html',
            controller: 'EventController as events'
        })
    });

    module.controller('ShiftController', function ($scope, EventService, ShiftService) {
        EventService.query(function(res) {
            $scope.events = res;
        });

        $scope.take_shift = function(shift)
        {
            ShiftService.take_shift(shift);
        }
    });
})();