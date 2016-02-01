angular.module('app').controller('HtmlTestingCtrl', function($scope){
  $scope.$broadcast('rebuild:me');
});