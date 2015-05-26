'use strict';
(function () {
    

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
        $stateProvider.state('createevent', {
            url: '/create',
            templateUrl: 'static/partial/edit_event.html',
            controller: 'EventCreateController as create_event'
        });
        $stateProvider.state('editevent', {
            url: '/edit/:eventId',
            templateUrl: 'static/partial/edit_event.html',
            controller: 'EventEditController as edit_event'
        });
        $stateProvider.state('cloneevent', {
            url: '/clone/:eventId',
            templateUrl: 'static/partial/edit_event.html',
            controller: 'EventCloneController as clone_event'
        });
        $stateProvider.state('yourshifts', {
            url: '/yourshifts',
            templateUrl: 'static/partial/yourshifts.html',
            controller: 'YourshiftController as yourshift'
        });
    });

    module.controller('ModalInstanceCtrl', function ($scope, $modalInstance, shift) {
        $scope.shifts = shift;

        $scope.ok = function () {
            console.log($scope.shifts);
            $modalInstance.close();
        };
    });

    module.controller('YourshiftController', function ($scope, $http, $modal) {
        $http.get('/rest/yourshift/').success(function (result) {
            $scope.your_shifts = result;
            $scope.sort_shifts();

        });

        $http.get('/rest/event/').success(function (result) {
            $scope.events = result;
        });


        $scope.sort_shifts = function () {
            $scope.shift_by_event = {};

            $scope.your_shifts.forEach(function (shift) {
                var event_id = shift['event']['id'];

                if (!(event_id in $scope.shift_by_event))
                    $scope.shift_by_event[event_id] = [];
                $scope.shift_by_event[event_id].push(shift);

            });
        };

        $scope.refresh_event = function () {
            $http.get('/rest/yourshift/').success(function (result) {
                $scope.your_shifts = result;
                $scope.sort_shifts();
            });
        };

        $scope.untake_shift = function (id) {
            $http.post('/free_shift', {shift_id: id})
                .success(function (result) {
                    $scope.refresh_event();
                });
        };

        $scope.open = function (shift) {
            var modalInstance = $modal.open({
                animation: true,
                templateUrl: 'static/partial/shiftDetail.html',
                controller: 'ModalInstanceCtrl',
                resolve: {
                    shift: function (){
                        return shift
                    }
                }
            });
        };
    });


    function tag_collisions(events, user) {
        var shifts = Array();
        var yourshifts = Array();

        events.forEach(function (event) {
            event.shifts.forEach(function (shift) {
                shifts.push(shift);
                if (shift['user']['id'] == user['id'])
                    yourshifts.push(shift);
            });
        });

    }




    module.controller('EventCreateController', function ($scope, EventService, $stateParams, $http, AuthService) {
        $scope.current_user = AuthService.currentUser();
        $scope.new_hour_count = 0;
        EventService.get({id: $stateParams.eventId}, function(res) {
            for(var i = 0; i < $scope.event.shifts; i++)
            {
                delete $scope.event.shifts[i]['id'];
            }
        });
    });
















    module.controller('EventEditController', function ($scope, EventService, $stateParams, $http, AuthService) {
        $scope.current_user = AuthService.currentUser();
        $scope.new_hour_count = 0;
        EventService.get({id: $stateParams.eventId}, function(res) {
            for(var i = 0; i < $scope.event.shifts; i++)
            {
                delete $scope.event.shifts[i]['id'];
            }
        });

        $http.get('/shifttype/').success(function (res) {
            $scope.shift_types = res;
        })

        $scope.new_shift = {duration: 6};

        $scope.clone = function (index) {
            var shift = $scope.event['shifts'][index];
            var new_shift = angular.copy(shift);
            delete new_shift['volunteer'];
            delete new_shift['id'];
            $scope.event['shifts'].splice(index + 1, 0, new_shift);
        }

        $scope.delete = function (index) {
            $scope.event['shifts'].splice(index, 1);
        }

        $scope.$watch('event.start', function (new_value, old_value) {
            if ($scope.event == undefined)
                return;

            for (var i = 0; i < $scope.event.shifts.length; i++) {
                event = $scope.event.shifts[i];

                var event_start = $scope.event['start'];
                if (!(event_start instanceof Date))
                    event_start = new Date(event_start);
                if (!(event['start'] instanceof Date))
                    event['start'] = new Date(event['start']);
                if (isNaN(event_start.getTime()))
                    return; // in case of invalid date
                event['start'].setYear(event_start.getFullYear());
                event['start'].setMonth(event_start.getMonth());
                event['start'].setDate(event_start.getDate());
            }
        });

        $scope.add_new_shift = function () {
            var new_shift = angular.copy($scope.new_shift);
            var shifts = $scope.event['shifts'];

            var event_start = $scope.event['start'];
            if (!(event_start instanceof Date))
                event_start = new Date(event_start);
            if (isNaN(event_start.getTime()))
                return; // in case of invalid date
            new_shift['start'].setYear(event_start.getFullYear());
            new_shift['start'].setMonth(event_start.getMonth());
            new_shift['start'].setDate(event_start.getDate());

            new_shift['stop'] = new Date(new_shift['start'].valueOf() + new_shift['duration'] * 3600 * 1000);
            for (var i = 0; i < shifts.length; i++) {
                if (new Date(shifts[i]['start']) > new_shift['start']) {
                    shifts.splice(i, 0, new_shift);
                    return;
                }
            }
            shifts.push(new_shift);
        }

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.save = function () {
            var event = angular.copy($scope.event);
            delete event['shifts'];
            delete event['responsible'];

            $http.post('/rest/event/', event).success(function (response) {
                var event_id = response['id'];
                var shifts = angular.copy($scope.event.shifts);

                shifts.forEach(function (shift) {
                    shift['stop'] = new Date(shift['start'].valueOf() + shift['duration'] * 3600 * 1000);
                    shift['shift_type'] = shift['shift_type']['id'];
                })
                $http.post('/rest/shift/', shifts).success(function (response) {

                });
            });

        };
    });















    module.controller('EventCloneController', function ($scope, EventService, $stateParams, $http, AuthService) {
        $scope.current_user = AuthService.currentUser();
        $scope.new_hour_count = 0;
        EventService.get({id: $stateParams.eventId}, function (res) {
            $scope.event = res;
            delete $scope.event['id'];
            for (var i = 0; i < $scope.event.shifts; i++) {
                delete $scope.event.shifts[i]['id'];
            }
        });

        $http.get('/shifttype/').success(function (res) {
            $scope.shift_types = res;
        })

        $scope.new_shift = {duration: 6};

        $scope.clone = function (index) {
            var shift = $scope.event['shifts'][index];
            var new_shift = angular.copy(shift);
            new_shift['volunteer'] = null;
            new_shift['id'] = null;
            $scope.event['shifts'].splice(index + 1, 0, new_shift);
        }

        $scope.delete = function (index) {
            $scope.event['shifts'].splice(index, 1);
        }

        $scope.$watch('event.start', function (new_value, old_value) {
            if ($scope.event == undefined)
                return;

            for (var i = 0; i < $scope.event.shifts.length; i++) {
                event = $scope.event.shifts[i];

                var event_start = $scope.event['start'];
                if (!(event_start instanceof Date))
                    event_start = new Date(event_start);
                if (!(event['start'] instanceof Date))
                    event['start'] = new Date(event['start']);
                if (isNaN(event_start.getTime()))
                    return; // in case of invalid date
                event['start'].setYear(event_start.getFullYear());
                event['start'].setMonth(event_start.getMonth());
                event['start'].setDate(event_start.getDate());
            }
        });

        $scope.add_new_shift = function () {
            var new_shift = angular.copy($scope.new_shift);
            var shifts = $scope.event['shifts'];

            var event_start = $scope.event['start'];
            if (!(event_start instanceof Date))
                event_start = new Date(event_start);
            if (isNaN(event_start.getTime()))
                return; // in case of invalid date
            new_shift['start'].setYear(event_start.getFullYear());
            new_shift['start'].setMonth(event_start.getMonth());
            new_shift['start'].setDate(event_start.getDate());

            new_shift['stop'] = new Date(new_shift['start'].valueOf() + new_shift['duration'] * 3600 * 1000);
            for (var i = 0; i < shifts.length; i++) {
                if (new Date(shifts[i]['start']) > new_shift['start']) {
                    shifts.splice(i, 0, new_shift);
                    return;
                }
            }
            shifts.push(new_shift);
        }

        $scope.open = function ($event) {
            $event.preventDefault();
            $event.stopPropagation();

            $scope.opened = true;
        };

        $scope.save = function () {
            var event = angular.copy($scope.event);
            delete event['id'];
            delete event['shifts'];
            delete event['responsible'];

            $http.post('/rest/event/', event).success(function (response) {
                var event_id = response['id'];
                var shifts = angular.copy($scope.event.shifts);

                shifts.forEach(function (shift) {
                    shift['event'] = event_id;
                    delete shift['id'];
                    delete shift['end_report'];
                    shift['stop'] = new Date(shift['start'].valueOf() + shift['duration'] * 3600 * 1000);
                    shift['shift_type'] = shift['shift_type']['id'];
                })
                $http.post('/rest/shift/', shifts).success(function (response) {

                });
            });
        }
    });

    module.controller('EventController', function ($scope, $http, EventService, ShiftService, AuthService) {
        $scope.current_user = AuthService.currentUser();

        $scope.refresh_event = function () {
            EventService.query(function (res) {
                $scope.events = res;
            });
        }


        $scope.refresh_event();

        $scope.is_staff = AuthService.isStaff();
        $scope.show_taken = false;

        $scope.take_shift = function (shift) {
            // var req = ShiftService.take_shift(shift);
            // req.success($scope.handle_response);
            $http.post('/take_shift', {shift_id: shift['id'], username: shift['new_volunteer']})
                .success(function (result) {
                    if (result['status'] == 'collides') {
                        shift['fail_reason'] = 'Collides with ' + result['desc'];
                    }
                    else if (result['status'] == 'ok') {
                        $scope.refresh_event();
                    }
                })
        }

        $scope.thefilter = function (x) {

            if ($scope.show_taken || x['volunteer'] == null)
                return x;
            return false;
        }

        $scope.remove_volunteer = function (shift) {
            $http.post('/free_shift', {shift_id: shift['id']})
                .success(function (result) {
                    $scope.refresh_event();
                });
        }

        $scope.handle_response = function () {
            EventService.query(function (res) {
                $scope.events = res;
                $scope.events.forEach(function (obj) {
                    obj['_volunteer'] = angular.copy(obj['volunteer']);
                });
            });
        }
    });

    module.controller('OverviewController', function ($scope, $stateParams, EventService, ShiftsReportService, AuthService) {
        $scope.is_staff = AuthService.isStaff();

        var eventLoader = function () {
            EventService.get({id: $stateParams.eventId}, function (res) {
                $scope.event = res;
                // Prefill data
                $scope.event.shifts.forEach(function (item) {
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

        $scope.confirm_shifts = function (event) {
            // Gather the data from the model to formulate separate REST query
            var output = [];
            $scope.event.shifts.forEach(function (item) {
                if (item.volunteer) {
                    output.push({
                        shift: item.id,
                        verified: item.verified,
                        corrected_hours: item.corrected_hours
                    });
                }
            });
            // Send data
            ShiftsReportService.save(output, function () {
                // Reload saved data
                eventLoader();
            });
        };

        $scope.handle_response = function () {
            EventService.query(function (res) {
                $scope.events = res;
            });
        }
    });
})();