(function() {
    'use strict';

    var module = angular.module('cyb.shifty', [
        'ui.router',
        'ngResource',
        'LocalStorageModule',
        'ui.bootstrap',
    ]);
    // Needed for refresh of calendar
    // Adapted from https://gist.github.com/cgmartin/3daa01f910601ced9cd3
    // Usage: $scope.$broadcast('refreshDatepickers');
    angular.module('ui.bootstrap.datepicker')
        .config(function($provide) {
            $provide.decorator('datepickerDirective', function($delegate) {
                var directive = $delegate[0];
                var link = directive.link;

                directive.compile = function() {
                    return function(scope, element, attrs, ctrls) {
                        link.apply(this, arguments);

                        var datepickerCtrl = ctrls[0];
                        var ngModelCtrl = ctrls[1];

                        if (ngModelCtrl) {
                            // Listen for 'refreshDatepickers' event...
                            scope.$on('refreshDatepickers', function refreshView() {
                                datepickerCtrl.refreshView();
                            });
                        }
                    }
                };
                return $delegate;
            });
        });


    module.config(function ($resourceProvider) {
        $resourceProvider.defaults.stripTrailingSlashes = false;
    });

    module.config(function ($locationProvider, $urlRouterProvider, $httpProvider) {
        //$locationProvider.html5Mode(true);

        $urlRouterProvider
            .otherwise(function() {
                console.log("unknown route");
            });

        $httpProvider.defaults.xsrfCookieName = 'csrftoken';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
    })
})();