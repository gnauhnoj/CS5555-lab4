'use strict';

angular.module('AngularFlask', [])
	.config(['$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'static/partials/landing.html',
			controller: IndexController
		})
		.when('/about', {
			templateUrl: 'static/partials/about.html',
			controller: AboutController
		})
		/* Create a "/blog" route that takes the user to the same place as "/post" */
		.when('/graphs', {
			templateUrl: 'static/partials/graphs.html',
			controller: GraphsController
		})
		.otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode(true);
	}])
;
