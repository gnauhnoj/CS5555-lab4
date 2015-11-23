angular.module('angularFlaskServices', ['ngResource'])
  .factory('getGraphData', function($resource) {
    return $resource('/api/graphdata', {}, {
      retrieve: {
        method: 'POST',
      },
      get: {
        method: 'GET'
      }
    });
  })
  .factory('getReccData', function($resource) {
    return $resource('/api/reccdata', {}, {
      get: {
        method: 'GET'
      }
    });
  });

// angular.module('dataServices', [])
//   .service('dataStore', function($rootScope, getGraphData) {
//     this.uploadData = {};
//     this.storedData = undefined;

//     this.storeAllData = function(dataStore, cb) {
//       getGraphData.get(this.uploadData, function(data) {
//         dataStore.storedData = data;
//         cb(data);
//       });
//     };
// });
