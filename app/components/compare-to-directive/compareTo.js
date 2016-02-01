angular.module('app').directive('compareTo', function ($compile) {
	return {
		restrict: 'A',
		require: "ngModel",
		scope: {
			compareTo: "=",
            validationMessage: "@",
            doValidationAndComparison: "@"
		},
		link: function (scope, element, attrs, ngModel) {

            // MODIFIED... before using please check example at _reset-password-modal.html

			scope.$parent.validComparison = true;
            scope.validInput = true;
            scope.showError = false;
            scope.errorMessage = "";
            scope.equalValues = true;

            // for now
            scope.errorMessage = scope.validationMessage;

            var e;
            e = angular.element('<p ng-show="showError" class="validation-error"> {{errorMessage}} </p>');
            var eCompiled = $compile(e)(scope);
            eCompiled.insertAfter(element);
            element.attr('is-dirty','true');

			var validateComparison = function () {
                element.attr('is-dirty','false');
				console.log(ngModel.$modelValue);
				console.log(scope.compareTo);
				if (ngModel.$modelValue !== scope.compareTo) {
					if (typeof ngModel.$modelValue === 'undefined' && scope.compareTo !== '') {
						scope.$apply(function () {
							scope.$parent.isValidForm = false;
                            scope.equalValues = false;
							//scope.$parent.validComparison = false;
						});
					}
					else if (scope.compareTo === '') {
						scope.$apply(function () {
							scope.$parent.isValidForm = true;
                            scope.equalValues = true;
							scope.$parent.validComparison = true;
						});
					}
					else{
						scope.$apply(function () {
							scope.$parent.isValidForm = false;
                            scope.equalValues = false;
							//scope.$parent.validComparison = false;
						});
					}
				}
				else {
					scope.$apply(function () {
						scope.$parent.isValidForm = true;
                        scope.equalValues = true;
						scope.$parent.validComparison = true;
					});
				}

                if(element.attr('activate-on')!=='keyup'){
                    console.log("checking error");
                    setError();
                }

			};

            var validationAndComparison = function () {

                element.attr('is-dirty','true');

                console.log(ngModel.$modelValue);
                console.log(scope.compareTo);

                // first validate
                if(element.val().length < 6 && element.val().length > 0 || element.val().length < 6 && element[0].required)
                {
                    scope.$apply(function () {
                        scope.validInput = false;
                        scope.showError = true;
                    });
                    element.attr('is-dirty','true');
                }
                else
                {
                    scope.$apply(function () {
                        scope.validInput = true;
                        scope.showError = false;
                    });
                    element.attr('is-dirty','false');
                }

                // then compare
                if (ngModel.$modelValue !== scope.compareTo) {
                    if (typeof ngModel.$modelValue === 'undefined' && scope.compareTo !== '') {
                        scope.$apply(function () {
                            scope.$parent.isValidForm = false;
                            scope.equalValues = false;
                           // scope.$parent.validComparison = false;
                        });
                    }
                    else if (scope.compareTo === '') {
                        scope.$apply(function () {
                            scope.$parent.isValidForm = true;
                            scope.equalValues = true;
                            scope.$parent.validComparison = true;
                        });
                    }
                    else{
                        scope.$apply(function () {
                            scope.$parent.isValidForm = false;
                            scope.equalValues = false;
                            //scope.$parent.validComparison = false;
                        });
                    }
                }
                else {
                    scope.$apply(function () {
                        scope.$parent.isValidForm = true;
                        scope.equalValues = true;
                        scope.$parent.validComparison = true;
                    });
                }

                if(element.attr('activate-on')!=='keyup'){
                    console.log("checking error");
                    setError();
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
                    if(scope.$parent.isValidForm !== false){
                        scope.$parent.isValidForm = !hasDirtyElements;
                    }
                });

            };

            var setError = function(){
                scope.$apply(function(){
                    scope.$parent.validComparison = scope.equalValues;
                });
            };

            if(element.attr('activate-on')==="keyup"){
                if (scope.doValidationAndComparison) {
                    element.on("keyup", validationAndComparison);
                    element.on("blur", setError);
                }
                else {
                    element.on("keyup", validateComparison);
                    element.on("blur", setError);
                }
            }
            else {
                if (scope.doValidationAndComparison) {
                    element.on("blur", validationAndComparison);
                }
                else {
                    element.on("blur", validateComparison);
                }
            }

		}
	};
});
