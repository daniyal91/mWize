angular.module('app').directive('formValidation', function () {
	return {
		restrict: 'A',
		require: '^form',
		scope: {
			formValidation: "@",
			validationMinLength: "@",
			validationMaxLength: "@"
		},
		link: function (scope, element, attrs, fn) {
			scope.setAttributesValues = function (element) {
				scope.elementValue = element.value.trim();
				var elementWithError = element.id + "_error";
				_.each(element.attributes, function (attr) {

					scope.validateWith = attr.name;
					scope.validateThis = attr.value;

					if (scope.validateWith === "validation-min-length") {
						if (scope.elementValue.length < scope.validateThis) {
							scope.$apply(function () {
								scope.$parent.inValidMinLength = false;
								scope.$parent.isValidForm = false;
								scope.$parent[elementWithError] = "Please provide more information in your question";
							});
						}
					}
					else if (scope.validateWith === "validation-max-length") {
						if (scope.elementValue.length > scope.validateThis) {
							scope.$apply(function () {
								scope.$parent.inValidMaxLength = false;
								scope.$parent.isValidForm = false;
								scope.$parent[elementWithError] = "Question maximum length reached";
							});
						}
					}
				});
			};

			element.on('click', function (event) {

				if(element[0].type === "button" || element[0].type === "submit"){
					var form = element.closest('form');

					angular.forEach(form.find('input, select'), function (element) {
						scope.$parent.isValidForm = true;
						scope.setAttributesValues(element);
					});
				}
				else {
					scope.$apply(function () {
						scope.$parent.inValidMinLength = true;
						scope.$parent.inValidMaxLength = true;
					});
				}
			});
		}
	};
});

