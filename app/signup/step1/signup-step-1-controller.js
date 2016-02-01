angular.module('app').controller('SignupStep1Ctrl',function($scope,$http,$state,$q,nbAuth){

  $scope.newUser = {};
  $scope.userRoles = ['expert','editor','writer'];
  $scope.isValidForm = false;
  
  $scope.signUp = function(){
    var deferred = $q.defer();
    var newUser = {username: $scope.newUser.username, email: $scope.newUser.email,
                   first_name: $scope.newUser.firstName, last_name: $scope.newUser.lastName,
                   password: $scope.newUser.password, role: $scope.newUser.role};
    nbAuth.signup(newUser).then(function(res){
        if(res.status===200)
        {
          var id = res.data.user.id;
          deferred.resolve("ok");
          $state.go('public.signup-step2',{ "id": id });
        }
      },function(res){
        deferred.reject("false");
        });
    return deferred.promise;
  };

});