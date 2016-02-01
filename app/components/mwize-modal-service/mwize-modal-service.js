angular.module('app').factory('mwizeModalService',function($rootScope,$modal) {

  var mwizeModalService = {};

  mwizeModalService.open = function(modalUrl,resolvedDataFn,customController,customWindowClass){

        var defaultController = ['$scope','$modalInstance','resolvedData',function ($scope, $modalInstance,resolvedData) {


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

        var controller = typeof customController !== 'undefined'? customController : defaultController;
        var windowClass = typeof customWindowClass === 'undefined'?'':customWindowClass;
        /*  
            Modal Options Which can be used:
            templateUrl:modalUrl,
            controller:controller,
            windowClass: windowClass,
            keyboard:false,
            backdrop:'static',
            scope:$scope});
        */

        this.modalInstance = $modal.open({
          templateUrl: modalUrl,
          controller: controller,
          windowClass: windowClass,
          backdrop:'static',
          resolve: {
            "resolvedData": function(){
                return resolvedDataFn;
            }
          }
        });
 
        return this.modalInstance.result;
    };

  return mwizeModalService;
});