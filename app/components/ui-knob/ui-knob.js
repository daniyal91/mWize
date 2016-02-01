angular.module('ui.knob', []).directive('knob', ['$timeout', function($timeout,$log) {
    'use strict';

    return {
        restrict: 'EA',
        replace: true,
        template: '<input value="{{ knobData }}"/>',
        scope: {
            knobData: '='
        },
        link: function($scope, $element) {
          
            $scope.$watch('knobData', function(newValue, oldValue) {
                if (newValue !== oldValue) {
                    $($element).val(newValue).change();
                }
            });
          
            $($element).val($scope.knobData).knob({
                width: 80,
                fgColor: "#FF0000",
                skin: "tron",
                thickness: 0.2,
                readOnly: true,
                "cursor":false,
                "min":0,
                "max":120,
                //displayInput: true,
                //displayPrevious: true,
                format: function(f){
                    var min = Math.floor(f/60);
                    var sec = f%60;
                    return min+":"+sec;
                }
            });
        }
    };
}]);