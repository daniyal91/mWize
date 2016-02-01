angular.module('app').controller('ForgotPasswordCtrl',function($scope,mwizeModalService,$state,userService,$q,$timeout){

	$scope.isValidForm = false;


	var forgotPasswordModalController = ['$scope','$modalInstance','resolvedData',function ($scope, $modalInstance,resolvedData) {
		$scope.emailSent = false;
        $scope.isEmailExists = true;

        $scope.emailExist = function(email){
            var deferred = $q.defer();
            var emailToCheck = {"email":email};
            userService.emailExist(emailToCheck).then(function(result){
                if(result.data.exists===1){
                    $scope.isEmailExists = true;
                    $scope.forgotPassword(email);
                }
            },function(result){
                if(result.data.exists===0){
                    $scope.isEmailExists = false;
                    $timeout(function(){
                        $scope.isEmailExists = true;
                    }, 2000);
                    deferred.reject("false");
                }
            });
            return deferred.promise;
        };

		$scope.forgotPassword = function(email){
			var deferred = $q.defer();
			userService.forgotPassword(email).then(function(data){
				$scope.emailSent = true;
				deferred.resolve("ok");
			},function(data){
				deferred.reject("false");
			});
			return deferred.promise;
		};

		$scope.data = resolvedData;
		$scope.ok = function () {
			$modalInstance.close({in:$scope.data,out:this});
		};

		$scope.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		$scope.close = function () {
			$modalInstance.close();
		};

	}];

	$scope.forgotPasswordModal = function(){
			mwizeModalService.open('app/forgot-password/_forgot-password-modal.html',{},forgotPasswordModalController,'custom-modal').then(function(data){
			},function(){
				console.log("Closed");
				$state.go('public.landing');
			});
	};

});