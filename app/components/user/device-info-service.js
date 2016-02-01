angular.module('app').factory('deviceInfoService', function ($resource, appConfig, $http, $q, $rootScope, $upload) {

    var deviceInfoService = {};

    deviceInfoService.getAllDeviceInfo = function(){
        var _deferred = $q.defer();
        var _deviceInfo = [];
        var _carriers = [];

        deviceInfoService.getAllDevicesName().then(function(result){
            console.log("device-info-service -- All Devices Name:",result.data);
            _deviceInfo = result.data;

            deviceInfoService.getAllDevicesModels().then(function(result){
                console.log("device-info-service -- All Devices Model:",result.data);
                for(var i=0;i<result.data.length;i++){
                    for(var j=0;j<=_deviceInfo.length;j++){
                        if(result.data[i]["device_id"] === _deviceInfo[j].id){
                            if(_deviceInfo[j].model===undefined){_deviceInfo[j].model=[];}
                            _deviceInfo[j].model.push(result.data[i].name);
                            break;
                        }
                    }
                }

                deviceInfoService.getAllDevicesOS().then(function(result){
                    console.log("device-info-service -- All Devices OS:",result.data);
                    for(var k=0;k<result.data.length;k++){
                        for(var m=0;m<_deviceInfo.length;m++){
                            if(result.data[k]["device_id"]===_deviceInfo[m].id){
                                _deviceInfo[m].os = result.data[k].name;
                                _deviceInfo[m]["os_id"] = result.data[k].id;
                            }
                        }
                    }

                    deviceInfoService.getAllOSVersion().then(function(result){
                        console.log("device-info-os-versions -- All Devices OS versions:",result.data);
                        for(var o=0;o<_deviceInfo.length;o++){
                            for(var p=0;p<result.data.length;p++){
                                if(_deviceInfo[o]["os_id"]===result.data[p]["operating_system_id"]){
                                    if(_deviceInfo[o]["os_version"]===undefined){_deviceInfo[o]["os_version"]=[];}
                                    _deviceInfo[o]["os_version"].push(result.data[p].name);
                                }
                            }
                        }

                        deviceInfoService.getAllCarriers().then(function(result){
                            console.log("device-info-carriers -- All Devices Carriers:",result.data);
                            _carriers = result.data;
                            var returnData = {"deviceInfo":_deviceInfo, "carriers":_carriers};

                            _deferred.resolve(returnData);

                        },function(data){
                            _deferred.reject("false");
                        });

                    },function(data){
                        _deferred.reject("false");
                    });

                },function(data){
                    _deferred.reject("false");
                });

            },function(data){
                _deferred.reject("false");
            });

        },function(data){
            _deferred.reject("false");
        });

        return _deferred.promise;
    };

    deviceInfoService.getAllDevicesName = function(){
        var deferred = $q.defer();
        $http.get(appConfig.apiURL+'/devices')         // provide end point
            .then(function(data) {
                deferred.resolve(data);
            },
            function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    deviceInfoService.getAllDevicesModels = function(){
        var deferred = $q.defer();
        $http.get(appConfig.apiURL+'/phone_models')         // provide end point
            .then(function(data) {
                deferred.resolve(data);
            },
            function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    deviceInfoService.getDeviceOS = function(deviceID){
        var deferred = $q.defer();
        $http.get(appConfig.apiURL+'/devices/'+deviceID+'/os')         // provide end point
            .then(function(data) {
                deferred.resolve(data);
            },
            function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    deviceInfoService.getAllDevicesOS = function(){
        var deferred = $q.defer();
        $http.get(appConfig.apiURL+'/devices/getAllOs')         // provide end point
            .then(function(data) {
                deferred.resolve(data);
            },
            function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    deviceInfoService.getAllOSVersion = function(){
        var deferred = $q.defer();
        $http.get(appConfig.apiURL+'/devices/getAllOsVersion')         // provide end point
            .then(function(data) {
                deferred.resolve(data);
            },
            function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    deviceInfoService.getAllCarriers = function(){
        var deferred = $q.defer();
        $http.get(appConfig.apiURL+'/carriers')         // provide end point
            .then(function(data) {
                deferred.resolve(data);
            },
            function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

    return deviceInfoService;

});
