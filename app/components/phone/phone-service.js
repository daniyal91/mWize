angular.module('app').factory('phoneService',function($resource,appConfig, $q, $http) {

  var phoneService = {};

  phoneService.resource = $resource(appConfig.apiURL+'/devices/:id',{},{
    query:  {method:'GET', isArray:true},
    save: {method:'POST'},
    update: {method: 'PUT'}
  });

	phoneService.getAllOsVersion = function () {
		var deferred = $q.defer();
		$http.get(appConfig.apiURL + '/devices/getAllOsVersion')
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	phoneService.getAllOperators = function(){
		var deferred = $q.defer();
		var operators = [{
			name: "orange"
		},{
			name: "warid"
		},{
			name: "ufone"
		},{
			name: "telenor"
		}];
		deferred.resolve(operators);
		return deferred.promise;
	};

  return phoneService;
});