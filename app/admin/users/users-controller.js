angular.module('app').controller('UsersCtrl',function($scope,$q,$state,$http,nbAuth,userService,mwizeModalService,$log){

  $scope.newUser = {};
  $scope.newUser.role = 'expert';
  $scope.page = {current: 1, total_items: 0, items_per_page: 5};
  $scope.isValidForm = false;
  $scope.selectedAreaOfExpertise = [];
  $scope.experts = [];
  $scope.users = {};
  $scope.users.email = [];

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
        $scope.completeProfile(id);
        $scope.experts.push({firstname:$scope.newUser.firstName,lastname:$scope.newUser.lastName,email:$scope.newUser.email});
      }
    },function(res){
      deferred.reject("false");
    });
    return deferred.promise;
  };

  $scope.getExpertise = function(){
    return $http.get(nbAuth.getHost()+'user_profiles').
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

  $scope.completeProfile = function(id,newUser){
    if($scope.selectedAreaOfExpertise.length>0)
    {
      var deferred = $q.defer();
      var userProfile = {country: newUser.userProfile.country,
                        expertise: $scope.selectedAreaOfExpertise, user_id: id};
      nbAuth.signupProfile(userProfile).then(function(res){
        if(res.status===200)
        {
          deferred.resolve("ok");
          $state.go('admin.expertlisting');
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

  $scope.listExperts = function(){
    $scope.experts = [];
    userService.resource.query({type:'expert'},function(data){
      angular.forEach(data.users,function(experts){
        $scope.experts.push({firstname:experts.first_name,lastname:experts.last_name,email:experts.email});
        $scope.users.email.push(experts.email);
      });
      $scope.page.total_items = $scope.experts.length;
      $scope.totalExperts = $scope.experts.length;
    });
  };

  $scope.addNew = function(){
    $scope.getExpertise().then(function(){
      var dataIn = {areasOfExpertise: $scope.areasOfExpertise};
      mwizeModalService.open('app/admin/users/users.html', dataIn).then(function(data){
        var deferred = $q.defer();
        angular.forEach(data.in.areasOfExpertise,function(selected){
          if(selected.checked){
            $scope.selectedAreaOfExpertise.push(selected.id);
          }
        });
        var newUser = {username: data.out.newUser.username, email: data.out.newUser.email,
                       first_name: data.out.newUser.firstName, last_name: data.out.newUser.lastName,
                       password: data.out.newUser.password, role: $scope.newUser.role};
        nbAuth.signup(newUser).then(function(res){
         console.log('User Signed Up');
          if(res.status===200)
          {
            var id = res.data.user.id;
            deferred.resolve("ok");
            $scope.completeProfile(id,data.out);
            $scope.experts.push({firstname:data.out.newUser.firstName,lastname:data.out.newUser.lastName,email:data.out.newUser.email});
            $scope.page.total_items = $scope.page.total_items + 1;
            $scope.totalExperts = $scope.page.total_items;
          }
        },function(res){
          deferred.reject("false");
        });
        return deferred.promise;

      }, function () {
        $log.info('Modal dismissed at: ' + new Date());
      });
    });
  };

  $scope.pageChanged = function(page){
   $scope.page.current = page;
  };

  $scope.sort_by = function(predicate){
    $scope.predicate = predicate;
    $scope.reverse = !$scope.reverse;
  };

  $scope.filter = function(){

  };

});