angular.module('app').directive('opValidationCheck', function($compile) {
  return {
    restrict: 'A',
    scope: {
      opValidationCheck: "@",
      opValidationOnlyNumbers: "@",
      opValidationOnlyAlphabets: "@",
      opValidationOnlyZip: "@",
      opValidationMinLength: "@",
      opValidationMaxLength: "@",
      opValidationOnlyFloat: "@",
      opValidationOnlyAlphanumeric: "@",
      opValidationStyle: "@"
    },
    link: function (scope, element, attrs) {
      scope.opValidInput = true;
      scope.opShowError = false;

      var e;
      if(scope.opValidationStyle==='style-1'){
        e = angular.element('<p ng-show="opShowError" class="validation-error text-left" style="margin-bottom: -3px !important;"> {{opValidationCheck}} </p>');
      }
      else{
        e = angular.element('<p ng-show="opShowError" class="validation-error"> {{opValidationCheck}} </p>');
      }
      var eCompiled = $compile(e)(scope);
      if(scope.opValidationStyle==='style-1'){
        eCompiled.insertBefore(element);
      }
      else{
        eCompiled.insertAfter(element);
      }
      element.attr('is-op-dirty','false');
      console.log(element.attr('ng-model') + " - is-op-dirty:",element.attr('is-op-dirty'));

      var checkOpValidationFunc = function(event){
        var elementType = element[0].type;
        if(elementType === 'email')
        {
          var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if(regex.test(element.val()) === true)
          {
            scope.$apply(function () {
              scope.opValidInput = true;
            });
            element.attr('is-op-dirty','false');
          }
          else
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
        }
        else if(elementType === 'password')
        {
          if(element.val().length < 6 && element.val().length > 0 || element.val().length < 6 && element[0].required)
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
          else
          {
            scope.$apply(function () {
              scope.opValidInput = true;
            });
            element.attr('is-op-dirty','false');
          }
        }
        else if(elementType === 'text')
        {
          var regexOnlyNumber = /^[0-9]*$/;
          var regexOnlyAlpha = /^[a-zA-Z ]+$/;
          var regexZip =/^[0-9]{5}(?:-[0-9]{4})?$/;
          var regexOnlyFloat = /^[0-9]*([.][0-9]+)?$/;
          var regexOnlyAlphanumeric = /^[a-zA-Z0-9 ]{1,30}$/;
          if(scope.opValidationOnlyNumbers==='true' && regexOnlyNumber.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
          else if(element[0].value.length < parseInt(scope.opValidationMinLength))
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
            eCompiled.html("Please provide more information in your question.");
            eCompiled.insertAfter($(".opValidation-error").closest(".search"));
          }
          else if(element[0].value.length > parseInt(scope.opValidationMaxLength))
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
            eCompiled.html("Question maximum length reached.");
            eCompiled.insertAfter($(".opValidation-error").closest(".search"));
          }
          else if(scope.opValidationOnlyAlphabets==='true' && regexOnlyAlpha.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
          else if(scope.opValidationOnlyFloat==='true' && regexOnlyFloat.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
          else if(scope.opValidationOnlyAlphanumeric==='true' && regexOnlyAlphanumeric.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
          else if(scope.opValidationOnlyZip==='true' && regexZip.test(element.val()) === false)
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
          else
          {
            if(element.val().length <= 0)
            {
              scope.$apply(function () {
                scope.opValidInput = false;
              });
              element.attr('is-op-dirty','true');
            }
            else
            {
              scope.$apply(function () {
                scope.opValidInput = true;
              });
              element.attr('is-op-dirty','false');
            }
          }
        }
        else if(elementType === 'textarea')
        {
          if(element.val().length <= 0)
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
          else
          {
            scope.$apply(function () {
              scope.opValidInput = true;
            });
            element.attr('is-op-dirty','false');
          }
        }
        else if(elementType === 'select-one')
        {
          if(element.val() === '')
          {
            scope.$apply(function () {
              scope.opValidInput = false;
            });
            element.attr('is-op-dirty','true');
          }
          else
          {
            scope.$apply(function () {
              scope.opValidInput = true;
            });
            element.attr('is-op-dirty','false');
          }
        }
        else
        {
          // For other input types, checks will go here.
        }

        if(element.attr('op-activate-on')!=='keyup'){
          console.log("checking error");
          checkOpError();
        }
        else{
          if(scope.opValidInput===true){
            scope.opShowError = false;
          }
        }

        var form = element.closest('form');
        var hasDirtyElements = false;

        console.log("validating value");

        angular.forEach(form.find('input, select'), function(node){
          if(node.getAttribute("is-op-dirty") === 'true')
          {
            // if not empty string
            if(element.val().length!==0){
              hasDirtyElements=true;
            }
            // if emtpy string
            else{
              scope.opValidInput = true;
              scope.opShowError = false;
              node.setAttribute("is-op-dirty",'false');
            }
          }
        });

        scope.$apply(function () {
          scope.$parent.isOpFieldValid = !hasDirtyElements;
          //console.log("isOpFieldValid changes to: ",scope.$parent.isOpFieldValid);
        });

        // all style goes here
        if(scope.opValidationStyle==='style-1'){
          if(scope.opValidInput===false) {
            element[0].style.borderColor = "red";
          }
          else{
            element[0].style.borderColor = "";
          }
        }

      };

      // function for error message display
      var checkOpError = function(){
        scope.$apply(function (){
          if(scope.opValidInput === false){
            console.log("show error = true");
            if(element.val().length!==0){
              scope.opShowError = true;
            }
          }
          else {
            console.log("show error = false");
            scope.opShowError = false;
          }
        });
      };
      // elements where value has to validate before pressing 'tab' or focuing out,
      // attach activate-on="keyup" attribute there, e.g: signup popup
      if(element.attr('activate-on')==="keyup"){
        element.on('keyup',checkOpValidationFunc);
        element.on('blur', checkOpError);
      }
      else{
        element.on('blur', checkOpValidationFunc);
      }

    }
  };
});