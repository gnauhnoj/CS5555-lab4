'use strict';

angular.module('angularFlaskServices', ['ngResource'])
  .factory('getGraphData', function($resource) {
    return $resource('/api/graphdata', {}, {
      retrieve: {
        method: 'POST',
      }
    });
});

angular.module('dataServices', [])
  .service('dataStore', function($rootScope, getGraphData) {
    this.uploadData = {};
    this.storedData = undefined;

    this.retrieveData = function(dataStore, cb) {
      getGraphData.retrieve(this.uploadData, function(data) {
        dataStore.storedData = data;
        cb(data);
      });
    };
});
