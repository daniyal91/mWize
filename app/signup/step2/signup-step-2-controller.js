angular.module('app').controller('SignupStep2Ctrl',function($scope,$http,$state,$q,nbAuth){

  $scope.userProfile = {};
  $scope.selectedAreaOfExpertise = [];
  $scope.newUser = nbAuth.userProfile;
  $scope.isValidForm = false;
  
  $scope.getExpertise = function(){
    $http.get(nbAuth.getHost()+'user_profiles').
        success(function(data, status, headers, config) {
          $scope.areasOfExpertise = data.expertises;
        }).
        error(function(data, status, headers, config) {
         
        });
  };

  $scope.selectedExpertise = function(expertise){
    if(expertise.checked === true)
    {
      $scope.selectedAreaOfExpertise.push(expertise.id);
    }
    else
    {
      $scope.selectedAreaOfExpertise.splice( $scope.selectedAreaOfExpertise.indexOf(expertise), 1);
    }
  };

  $scope.completeProfile = function(){
    // if($scope.selectedAreaOfExpertise)
    // {
    //   $scope.selectedAreaOfExpertise = $scope.selectedAreaOfExpertise.toString();
    // }
    // else
    // {
    //   // do nothing
    // }
    if($scope.selectedAreaOfExpertise.length>0)
    {
      var deferred = $q.defer();
      var userProfile = {age: $scope.userProfile.age, gender: $scope.userProfile.gender,
                         address_line_1: $scope.userProfile.address1,
                         address_line_2: $scope.userProfile.address2,
                         state: $scope.userProfile.state, zip: $scope.userProfile.zip,
                         city: $scope.userProfile.city, country: $scope.userProfile.country,
                         expertise: $scope.selectedAreaOfExpertise, user_id: $scope.newUser.id};
      nbAuth.signupProfile(userProfile).then(function(res){
          if(res.status===200)
          {
            deferred.resolve("ok");
            $state.go('public.signup-quiz',{id: res.data.id});
          }
        },function(res){
          deferred.reject("false");
          });
      return deferred.promise;
    }
    else
    {
      $scope.expertiseNullError = true;
    }
    
  };

});