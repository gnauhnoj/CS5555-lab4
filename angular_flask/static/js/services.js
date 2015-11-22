'use strict';

angular.module('angularFlaskServices', ['ngResource'])
  .factory('getData', function($resource) {
    return $resource('/api/processdata', {}, {
      retrieve: {
        method: 'POST',
      }
    });
  })
;
