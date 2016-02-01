angular.module('app').factory('userService', function ($resource, appConfig, $http, $q, $rootScope, $upload) {

  var userService = {};

	userService.resource = $resource(appConfig.apiURL + '/users/:id', {}, {
		query: {method: 'GET', isArray: false},
		save: {method: 'POST'},
		update: {method: 'PUT'}
	});

  userService.emailExist = function(email){
    var deferred = $q.defer();
    var that = this;
    $http.post(appConfig.apiURL+'/users/email_exists',email)
      .then(function(data){
        deferred.resolve(data);
      },
      function(data){
        deferred.reject(data);
      });
    return deferred.promise;
  };

	userService.forgotPassword = function (email) {
		var deferred = $q.defer();
		var that = this;
		$http.get(appConfig.apiURL + '/users/forgot_password?email=' + email)
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.verifyToken = function (token) {
		var deferred = $q.defer();
		var that = this;
		$http.get(appConfig.apiURL + '/users/verify_token?token=' + token)
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.consumerSignup = function (user, email) {
		var deferred = $q.defer();
		var that = this;
		$http.put(appConfig.apiURL + '/users/' + user.user_id + '/update_guest', {email: email})
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.getUserProfile = function () {
		var deferred = $q.defer();
		$http.get(appConfig.apiURL + '/user_profiles/' + $rootScope.user.user_id)
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.updateUserProfile = function (body) {
		var deferred = $q.defer();
		$http.put(appConfig.apiURL + '/user_profiles/' + $rootScope.user.user_id, body)
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.getUserAvatar = function () {
		var deferred = $q.defer();

		$http.get(appConfig.apiURL + '/users/get_avatar_by_user')
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.updateUser = function (body) {
		var deferred = $q.defer();
		$http.put(appConfig.apiURL + '/users/' + $rootScope.user.user_id, body)
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.updateUserPassword = function (body) {
		var deferred = $q.defer();
		$http.put(appConfig.apiURL + '/users/update_password', body)
			.then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.uploadUserAvatar = function (uploadedAvatar) {
		var deferred = $q.defer();
		$upload.upload({
			url: appConfig.apiURL + '/users/' + $rootScope.user.user_id + '/upload_avatar',
			file: uploadedAvatar
		}).then(function (data) {
				deferred.resolve(data);
			},
			function (data) {
				deferred.reject(data);
			});
		return deferred.promise;
	};

  userService.getUserDevices = function(){
    var deferred = $q.defer();
    $http.get(appConfig.apiURL+'/user_devices')
      .then(function(data) {
        deferred.resolve(data);
      },
      function(data){
        deferred.reject(data);
      });
    return deferred.promise;
  };

  userService.saveUserDevices = function(deviceInfo){
    var deferred = $q.defer();
    $http.post(appConfig.apiURL+'/user_devices',deviceInfo)
      .then(function(data) {
        console.log("save successful");
        deferred.resolve(data);
      },
      function(data){
        console.log("save error");
        deferred.reject(data);
      });
    return deferred.promise;
  };

  userService.updateUserDevices = function(deviceInfo){
    var deferred = $q.defer();
    $http.put(appConfig.apiURL+'/user_devices/'+deviceInfo.id,deviceInfo)
      .then(function(data) {
        console.log("update successful");
        deferred.resolve(data);
      },
      function(data){
        console.log("update error");
        deferred.reject(data);
      });
    return deferred.promise;
  };

  userService.getAllDevicesName = function(){
    var deferred = $q.defer();
    $http.get(appConfig.apiURL+'/devices')         // provide end point
      .then(function(data) {
        deferred.resolve(data);
      },
      function(data){
        deferred.reject(data);
      });
    return deferred.promise;
  };

  userService.getAllDevicesModels = function(){
    var deferred = $q.defer();
    $http.get(appConfig.apiURL+'/phone_models')         // provide end point
      .then(function(data) {
        deferred.resolve(data);
      },
      function(data){
        deferred.reject(data);
      });
    return deferred.promise;
  };

  userService.getDeviceOS = function(deviceID){
    var deferred = $q.defer();
    $http.get(appConfig.apiURL+'/devices/'+deviceID+'/os')         // provide end point
      .then(function(data) {
        deferred.resolve(data);
      },
      function(data){
        deferred.reject(data);
      });
    return deferred.promise;
  };

	userService.removeDevice = function(deviceID){
		var deferred = $q.defer();
		$http.delete(appConfig.apiURL+'/user_devices/'+deviceID)
			.then(function(data) {
				deferred.resolve(data);
			},
			function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};

	userService.getAllOs = function(){
    var deferred = $q.defer();
    $http.get(appConfig.apiURL+'/devices/getAllOs') 
      .then(function(data) {
        deferred.resolve(data);
      },
      function(data){
        deferred.reject(data);
      });
    return deferred.promise;
  };

  return userService;

});