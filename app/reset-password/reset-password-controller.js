angular.module('app').controller('ResetPasswordCtrl',function($scope,mwizeModalService,$state,userService){

  $scope.isValidForm = false;
    //$scope.validComparison = true;

  var resetPasswordModalController = ['$scope','$modalInstance','resolvedData',function ($scope, $modalInstance,resolvedData) {

    $scope.passwordResetToken = $state.params.token;
    $scope.isFormDirty = false;
    $scope.credentials = {
      password:"",
      confirmPassword:""
    };

    $scope.verifyToken = function(passwordResetToken){
      userService.verifyToken(passwordResetToken).then(function(data){
        var tokenExpired = data.data.expired;
        if(tokenExpired)
        {
          $scope.showResetPasswordForm = false;
          $scope.showResetPasswordConfirmation = false;
          $scope.showTokenExpirationError = true;
        }
        else
        {
          $scope.showResetPasswordForm = true;
          $scope.showResetPasswordConfirmation = false;
          $scope.showTokenExpirationError = false;
          $scope.userId = data.data.user;
        }
      });

    };

    $scope.verifyToken($scope.passwordResetToken);

    $scope.passwordMatch = true;
    // $scope.showResetPasswordForm = true;
    // $scope.showResetPasswordConfirmation = false;
    // $scope.showTokenExpirationError = false;

    $scope.resetPassword = function(password){
      if($scope.credentials.password===$scope.credentials.confirmPassword){
        this.validComparison = true;
        if(this.validComparison && this.isValidForm){
          var newPassword = {password: password};
          userService.resource.update({id: $scope.userId},newPassword,function(data){
            $scope.showResetPasswordForm = false;
            $scope.showResetPasswordConfirmation = true;
            $scope.showTokenExpirationError = false;
          });
        }
      }
      else{
        this.validComparison = false;
      }
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

  $scope.resetPasswordModal = function(){
    mwizeModalService.open('app/reset-password/_reset-password-modal.html',{},resetPasswordModalController,'custom-modal').then(function(data){
      $scope.loginModal();
    },function(){
      console.log("Closed");
      $state.go('public.landing');
    });
  };

});
