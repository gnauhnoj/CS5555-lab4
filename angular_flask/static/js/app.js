'use strict';

angular.module('AngularFlask', ['ngRoute'])
	.config([
		'$routeProvider', '$locationProvider',
		function($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: 'static/partials/landing.html',
			controller: IndexController
		})
		 // Create a "/blog" route that takes the user to the same place as "/post"
		.when('/graphs', {
			templateUrl: 'static/partials/graphs.html',
			controller: GraphsController
		})
		.otherwise({
			redirectTo: '/'
		});

		$locationProvider.html5Mode({
			enabled: true,
			requireBase: false
		});
	}
	]);
