angular.module('app').directive('validationCheck', function($compile) {
  return {
    restrict: 'A',
    scope: {
      validationCheck: "@",
      validationOnlyNumbers: "@",
      validationOnlyAlphabets: "@",
      validationOnlyZip: "@",
      validationMinLength: "@",
      validationMinMessage: "@",
      validationMaxLength: "@",
      validationMaxMessage: "@",
      validationOnlyFloat: "@",
      validationOnlyAlphanumeric: "@",
      validationOnlyAlphanumericWithoutSpace: "@",
      validationStyle: "@"
    },
    link: function (scope, element, attrs) {
      scope.validInput = true;
      scope.showError = false;
      scope.errorMessage = "";

      // for now
      scope.errorMessage = scope.validationCheck;

      var e;
      if(scope.validationStyle==='style-1'){
        e = angular.element('<p ng-show="showError" class="validation-error text-left" style="margin-bottom: -3px !important;"> {{errorMessage}} </p>');
      }
      else{
        e = angular.element('<p ng-show="showError" class="validation-error"> {{errorMessage}} </p>');
      }
      var eCompiled = $compile(e)(scope);
      if(scope.validationStyle==='style-1'){
        eCompiled.insertBefore(element);
      }
      else{
        eCompiled.insertAfter(element);
      }
      element.attr('is-dirty','true');

      var checkValidationFunc = function(event){
        var elementType = element[0].type;
        if(elementType === 'email')
        {
          var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(regex.test(element.val()) === true)
          {
            scope.$apply(function () {
              scope.validInput = true;
            });
            element.attr('is-dirty','false');
          }
          else
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
        }
        else if(elementType === 'password')
        {
          if(element.val().length < 6 && element.val().length > 0 || element.val().length < 6 && element[0].required)
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else
          {
            scope.$apply(function () {
              scope.validInput = true;
            });
            element.attr('is-dirty','false');
          }
        }
        else if(elementType === 'text')
        {
          var regexOnlyNumber = /^[0-9]*$/;
          var regexOnlyAlpha = /^[a-zA-Z ]+$/;
          var regexZip =/^[0-9]{5}(?:-[0-9]{4})?$/;
          var regexOnlyFloat = /^[0-9]*([.][0-9]+)?$/;
          var regexOnlyAlphanumeric = /^[a-zA-Z0-9 ]{1,30}$/;
          var regexOnlyAlphanumericWithoutSpace = /^[a-zA-Z0-9]{1,30}$/;

          // First Check Regex (input value)
          if(scope.validationOnlyNumbers==='true' && regexOnlyNumber.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else if(scope.validationOnlyAlphabets==='true' && regexOnlyAlpha.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else if(scope.validationOnlyFloat==='true' && regexOnlyFloat.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else if(scope.validationOnlyAlphanumeric==='true' && regexOnlyAlphanumeric.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else if(scope.validationOnlyAlphanumericWithoutSpace==='true' && regexOnlyAlphanumericWithoutSpace.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else if(scope.validationOnlyZip==='true' && regexZip.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else
          {
            if(element.val().length <= 0)
            {
              scope.$apply(function () {
                scope.validInput = false;
              });
              element.attr('is-dirty','true');
            }
            else
            {
              scope.$apply(function () {
                scope.validInput = true;
              });
              element.attr('is-dirty','false');
            }
          }

          // Now check for min and max length
          if(element[0].value.length > 0){
            if(scope.validationMinLength!=="" || scope.validationMinLength!==null || scope.validationMinLength!==undefined){
              if(element[0].value.length < parseInt(scope.validationMinLength))
              {
                scope.$apply(function () {
                  scope.validInput = false;
                });
                element.attr('is-dirty','true');
                if(scope.validationMinMessage){
                  scope.errorMessage = scope.validationMinMessage;
                }
                else{
                  scope.errorMessage = "minimum length should be "+scope.validationMinLength;
                }
              }
            }
            if(scope.validationMaxLength!=="" || scope.validationMaxLength!==null || scope.validationMaxLength!==undefined){
              if(element[0].value.length > parseInt(scope.validationMaxLength))
              {
                scope.$apply(function () {
                  scope.validInput = false;
                });
                element.attr('is-dirty','true');
                if(scope.validationMaxMessage){
                  scope.errorMessage = scope.validationMaxMessage;
                }
                else{
                  scope.errorMessage = "maximum length should be "+scope.validationMaxLength;
                }
              }
            }
          }



        }
        else if(elementType === 'textarea')
        {
          if(element.val().length <= 0)
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else
          {
            scope.$apply(function () {
              scope.validInput = true;
            });
            element.attr('is-dirty','false');
          }
        }
        else if(elementType === 'select-one')
        {
          if(element.val() === '')
          {
            scope.$apply(function () {
              scope.validInput = false;
            });
            element.attr('is-dirty','true');
          }
          else
          {
            scope.$apply(function () {
              scope.validInput = true;
            });
            element.attr('is-dirty','false');
          }
        }
        else
        {
          // For other input types, checks will go here.
        }

        if(element.attr('activate-on')!=='keyup'){
          console.log("checking error");
          checkError();
        }
        else{
          if(scope.validInput===true){
            scope.showError = false;
          }
        }

        var form = element.closest('form');
        var hasDirtyElements = false;

        console.log("validating value");

        angular.forEach(form.find('input, select'), function(node){
          if(node.getAttribute("is-dirty") === 'true')
          {
            hasDirtyElements=true;
          }
        });

        scope.$apply(function () {
          scope.$parent.isValidForm = !hasDirtyElements;
        });

        // all style goes here
        if(scope.validationStyle==='style-1'){
          if(scope.validInput===false) {
            element[0].style.borderColor = "red";
          }
          else{
            element[0].style.borderColor = "";
          }
        }

      };

      // function for error message display
      var checkError = function(){
        scope.$apply(function (){
          if(scope.validInput === false){
            console.log("show error = true");
            scope.showError = true;
          }
          else {
            console.log("show error = false");
            scope.showError = false;
          }
        });
      };

      // elements where value has to validate before pressing 'tab' or focuing out,
      // attach activate-on="keyup" attribute there, e.g: signup popup
      if(element.attr('activate-on')==="keyup"){
        element.on('keyup',checkValidationFunc);
        element.on('blur', checkError);
      }
      else{
        element.on('blur', checkValidationFunc);
      }

    }
  };
});
