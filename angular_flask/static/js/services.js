'use strict';

angular.module('angularFlaskServices', ['ngResource'])
  .factory('getData', function($resource) {
    return $resource('/api/processdata', {}, {
      retrieve: {
        method: 'POST',
      }
    });
});

angular.module('dataServices', [])
  .service('dataStore', function($rootScope, getData) {
    this.uploadData = {};
    this.storedData = undefined;

    this.retrieveData = function(dataStore, cb) {
      getData.retrieve(this.uploadData, function(data) {
        dataStore.storedData = data;
        cb(data);
      });
    };
});
