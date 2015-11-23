angular.module('AngularFlask', ['ngRoute', 'angularFlaskServices'])
.config([
	'$routeProvider', '$locationProvider',
	function($routeProvider, $locationProvider) {
	$routeProvider
	.when('/', {
		templateUrl: 'static/partials/landing.html',
		controller: IndexController
	})
	.when('/graphs', {
		templateUrl: 'static/partials/graphs.html',
		controller: GraphsController
	})
	.when('/analysis', {
		templateUrl: 'static/partials/analysis.html',
		controller: AnalysisController
	})
	.when('/recommendations', {
		templateUrl: 'static/partials/recommendations.html',
		controller: RecommendationsController
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
