angular.module('app').controller('UserDevicesCtrl',function($scope, $modalInstance, resolvedData, userService, $q, $rootScope, $timeout){
  $scope.isValidForm = false;
  $scope.isOpFieldValid = true;
  $scope.showAllFielsError = false;
  $scope.firstRun = true;
  $scope.allDevicesInfo = [];
  $scope.deviceModel = [];
  $scope.deviceName = [];
  // $scope.device will contain os, modal, osVersion, etc
  $scope.device = {"user_id":null, "device_title":"",
    "name":"","network_name":null,"total_memory":null,
    "total_space":null,"model":"","os":"","os_version":""};

  $scope.data = resolvedData;
  $scope.ok = function () {
    $modalInstance.close({in:$scope.data,out:this});
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.close = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.tooltipClick = function(){
    var win = window.open('http://new.mwize.com/ios-iphone-6-top-10-things/', '_blank');
  };

  $scope.saveUserDevices = function(){
    $scope.device.user_id = $rootScope.user.user_id;
    var deferred = $q.defer();
    if($scope.device.os!=="" && $scope.device.model!=="" && $scope.device.os_version!=="" && $scope.device.name!=="" && $scope.device.device_title!=="" && this.isValidForm!==false && this.isOpFieldValid!==false){
      $scope.showAllFielsError = false;
      if($scope.data.add===1){
        userService.saveUserDevices($scope.device).then(function(data){
          deferred.resolve("ok");
          $scope.ok();
        },function(data){
          deferred.reject("false");
        });
      }
      else if($scope.data.add===0){
        userService.updateUserDevices($scope.device).then(function(data){
          deferred.resolve("ok");
          $scope.ok();
        },function(data){
          deferred.reject("false");
        });
      }
    }
    else {
      $scope.showAllFielsError = true;
      $(function() {
        $('.device-info-modal-body').scrollTop(0);
      });
      deferred.reject("false");
    }
    return deferred.promise;
  };

  $timeout(function(){
    $(".device-info-modal-body .ps-scrollbar-y").css("height","323px");
  },500);

  $scope.allDevicesInfo = $.extend({},$scope.data.deviceInfo);

  // if 'edit device' click
  if($scope.data.add===0){
    $timeout(function(){
      $scope.$apply(function(){
        $scope.device = $.extend({},$scope.data.device);
      });
      // trigger event manually for input field(s), using validation-directive
      $(".input-title").blur();
      $(".input-os-version").blur();
      /*      $(".input-netwrok-name").keyup();
       $(".input-total-memory").keyup();
       $(".input-total-space").keyup();*/
    },800);
  }

  // watch
  $scope.$watch('device.os', function() {
    if( $scope.device !== undefined){
      if($scope.device.os!==""){
        if($scope.firstRun!==true){
          $scope.device.model = "";
          $scope.device.name = "";
        }
        $scope.firstRun = false;
      }
      $scope.deviceName = [];
      for(var i=0;i<$scope.allDevicesInfo.length;i++){
        if( $scope.device.os===$scope.allDevicesInfo[i].os){
          $scope.deviceModel = $scope.allDevicesInfo[i].model;
          $scope.deviceName.push($scope.allDevicesInfo[i].name);
        }
      }
    }
  });

});