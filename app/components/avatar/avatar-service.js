angular.module('app').factory('avatarService',function($http,$q,appConfig) {

	var avatarService = {};

  avatarService.getAvatars = function(){
    var deferred = $q.defer();
    var that = this;
    $http.get(appConfig.apiURL+'/avatars')
      .then(function(data) {
        deferred.resolve(data);
      },
      function(data){
        deferred.reject(data);
      });
    return deferred.promise;
  };

  // avatarService.createCustomAvatar = function(avatar){
  //   var deferred = $q.defer();
  //   var that = this;
  //   $http.post(nbAuth.getHost()+'avatars',avatar)
  //     .then(function(data) {
  //       deferred.resolve(data);
  //     },
  //     function(data){
  //       deferred.reject(data);
  //     });
  //   return deferred.promise;
  // };

  avatarService.deleteCustomAvatar = function(avatar){
    var deferred = $q.defer();
    var that = this;
    $http.delete(appConfig.apiURL+'/avatars/'+avatar.id)
      .then(function(data) {
        deferred.resolve(data);
      },
      function(data){
        deferred.reject(data);
      });
    return deferred.promise;
  };

	return avatarService;
});