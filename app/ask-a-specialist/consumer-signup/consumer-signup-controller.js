angular.module('app').controller('ConsumerSignupCtrl',function($scope,$modalInstance,resolvedData,$rootScope,userService,$q,nbAuth){

	$scope.isValidForm = false;
	$scope.emailSent = false;
	$scope.user = $rootScope.user;
	$scope.duplicateEmailError = false;

	$scope.data = resolvedData;

	$scope.signup = function(email){
		var deferred = $q.defer();
		$scope.email = email;

		var userAuthenticated = nbAuth.isAuthenticated();

		if(userAuthenticated === false)
		{
			var user = {email: $scope.email,  type: 'customer-signup'};

			userService.resource.save(user,function(data){
				$scope.emailSent = true;
				deferred.resolve("ok");
			},function(res){
				$scope.duplicateEmailError = true;
				deferred.reject("false");
			});
		}
		else //updateGuest
		{
			userService.consumerSignup($scope.user,$scope.email).then(function(data){
				$scope.emailSent = true;
				deferred.resolve("ok");
			},function(res){
				$scope.duplicateEmailError = true;
				deferred.reject("false");
			});
		}
		return deferred.promise;
	};

	$scope.ok = function () {
		$modalInstance.close({in:$scope.data,out:this});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.close = function () {
		$modalInstance.close();
	};

	$scope.RemoveError = function () {
		$scope.duplicateEmailError = false;
		//$rootScope.$broadcast('REMOVE_EMAIL_EXIST_ERROR',{remove:true});
	};

});