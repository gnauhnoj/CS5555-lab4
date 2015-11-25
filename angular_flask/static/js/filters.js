/* Filters */
angular.module('angularFlaskFilters', [])
  .filter('abs', function () {
  return function(val) {
    return Math.abs(val);
  };
});
