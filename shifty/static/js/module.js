(function() {
    'use strict';

    var module = angular.module('cyb.shifty', [
        'ui.router',
        'ngResource',
        'LocalStorageModule',
        'ui.bootstrap',
    ]);


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