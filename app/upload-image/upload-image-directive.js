angular.module('app').directive('uploadImage', function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, fn) {
            var model = $parse(attrs.uploadImage);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
		}
	};
});