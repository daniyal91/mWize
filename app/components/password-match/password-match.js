angular.module('app').directive('passwordMatch', function() {
  return {
    restrict: 'A',
    template: '<p class="validation-error"> Passwords do not match.</p>',
    link: function (scope, element, attrs) {
      var password = angular.element(document.querySelector('#reset_password_password'));
      var passwordConfirmation = angular.element(document.querySelector('#reset_password_password_confirmation'));
      var passwordConfirmationSubmit = angular.element(document.querySelector('#reset_password_form_submit'));
      passwordConfirmation.on('keyup',function(event){
        if(passwordConfirmation.val().length < 1)
        {
          // Do something
        }
        else
        {
          if(password.val() === passwordConfirmation.val())
          {
            scope.$apply(function () {
              scope.passwordMatch = true;
            });
          }
          else
          {
            scope.$apply(function () {
              scope.passwordMatch = false;
            });
          }
        }
      });
      password.on('blur',function(event){
        if(passwordConfirmation.val().length < 1)
        {
          // Do something
        }
        else
        {
          if(password.val() === passwordConfirmation.val())
          {
            scope.$apply(function () {
              scope.passwordMatch = true;
            });
          }
          else
          {
            scope.$apply(function () {
              scope.passwordMatch = false;
            });
          }
        }
      });
    }
  };
});