angular.module('app').factory('mwLog',function(appConfig, $q, $http, $timeout){

	var logService = {};

	var messages = [];

	logService.debug = function (message) {

		var logMessage = new Date().toString() + ': ' + message;
		messages.push(logMessage);

		$timeout(function () {
			var msgLength = messages.length;
			if (msgLength > 9) {
				logService.sendErrorLogs(messages).then(function(messages){
					console.log("MESSAGE: ", messages);
				});
				messages = [];
			}
		}, 10000);
	};

	logService.sendErrorLogs = function(messages){
		var deferred = $q.defer();
		$http.post(appConfig.apiURL+'/users/update_client_logs', messages)
			.then(function(data) {
				deferred.resolve(data);
			},
			function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};
	return logService;

});