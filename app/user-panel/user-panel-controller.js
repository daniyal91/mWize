angular.module('app').controller('UserPanelCtrl', function ($scope, userService, ticketService, expertiseLevel, nbAuth, $rootScope, avatarService, appConfig, mwizeModalService, $timeout, deviceInfoService) {

    $scope.init = function () {
        userService.getUserAvatar().then(function (userAvatar) {
            $scope.avatar = {};
            $scope.avatar.name = userAvatar.data.name;
            $scope.avatar.url = appConfig.protocol + appConfig.apiHost + "/avatars/" + userAvatar.data.name;
            userService.getUserProfile().then(function (userProfileInfo) {
                $scope.userProfile = userProfileInfo.data;
                $scope.expertiseLevel = $scope.userProfile.expertise_level;
                $scope.levelOfKnowledge = ($scope.expertiseLevel === expertiseLevel.novice) ? "I'm a Novice" : ($scope.expertiseLevel === expertiseLevel.intermediate) ? "Intermediate" : "Expert";
                userService.getUserDevices().then(function (userDeviceInfo) {
                    if (userDeviceInfo.data.length) {
                        $scope.totalDevices = userDeviceInfo.data.length;
                        $scope.deviceInfo = userDeviceInfo.data;
                        $scope.makeImageUrl();
                        $scope.percentComplete();
                        $scope.updateDeviceScrollBar();
                    }
                    ticketService.getQuestions().then(function (userQuestions) {
                        $scope.totalQuestions = userQuestions.data.count;
                    });
                });
            });
        });
    };

    $scope.checkUserAuthentication = function () {
        if (nbAuth.isAuthenticated() && !$rootScope.user.is_guest) {
            $scope.init();
        }
    };

    $scope.checkUserAuthentication();

    $scope.changeUserExpertiseLevel = function () {
        userService.updateUserProfile({expertise_level: $scope.expertiseLevel}).then(function () {
            $scope.levelOfKnowledge = ($scope.expertiseLevel === expertiseLevel.novice) ? "I'm a Novice" : ($scope.expertiseLevel === expertiseLevel.intermediate) ? "Intermediate" : "Expert";
        });
    };

    $scope.$on("updateAvatar", function (event, avatarName) {
        $scope.avatar.url = appConfig.protocol + appConfig.apiHost + "/avatars/" + avatarName;
    });

    $scope.addDevice = function () {
        $scope.userDevicesModal(1, null);
    };

    $scope.editDevice = function (device) {
        $scope.userDevicesModal(0, device);
    };


    $scope.userDevicesModal = function (i, device) {
        //  open when device/getAllOs API added
        var _deviceInfo = [];
        var _carriers = [];
        deviceInfoService.getAllDeviceInfo().then(function(result){
            _deviceInfo = result.deviceInfo;
            _carriers = result.carriers;

            mwizeModalService.open('app/user-panel/user-devices/_user-devices-modal.html', {"add": i, "device": device, "deviceInfo":_deviceInfo, "carriers":_carriers}, 'UserDevicesCtrl', 'custom-modal device-info-modal').then(function (data) {
                console.log("Closed 1");
                console.log("data from user devices modal:", data);
                userService.getUserDevices().then(function (userDeviceInfo) {
                    if (userDeviceInfo.data.length) {
                        $scope.totalDevices = userDeviceInfo.data.length;
                        $scope.deviceInfo = userDeviceInfo.data;
                        $scope.makeImageUrl();
                        $scope.percentComplete();
                        $scope.updateDeviceScrollBar();
                    }
                });
            }, function () {
                console.log("Closed 2");

            });
        });

        console.log("back to user panel");
    };

    $scope.editProfile = function () {
        mwizeModalService.open("app/user-panel/user-profile/_edit-profile-modal.html", $scope.avatar, 'UserProfileCtrl', 'custom-modal').then(function () {
        }, function () {
            console.log("Closed");
        });
    };

    $scope.percentComplete = function () {
        var fieldsCompleted = 0;
        var totalFields = 8;

        /*  // general way is not applicable because with device data we are also getting "created_at", "hash_id", etc
         for(var i=0;i<$scope.deviceInfo.length;i++){
         for (var item in $scope.deviceInfo[i]) {
         if ($scope.deviceInfo[i].hasOwnProperty(item)) {
         if ($scope.deviceInfo[i][item] !== "" && $scope.deviceInfo[i][item] !== null && $scope.deviceInfo[i][item] !== undefined) {
         fieldsCompleted++;
         }
         }
         }
         $scope.deviceInfo[i].percent_complete = Math.ceil((fieldsCompleted / totalFields) * 100);
         fieldsCompleted = 0;
         }*/

        for (var i = 0; i < $scope.deviceInfo.length; i++) {
            if ($scope.deviceInfo[i].device_title !== "" && $scope.deviceInfo[i].device_title !== null && $scope.deviceInfo[i].device_title !== undefined) {
                fieldsCompleted++;
            }
            if ($scope.deviceInfo[i].name !== "" && $scope.deviceInfo[i].name !== null && $scope.deviceInfo[i].name !== undefined) {
                fieldsCompleted++;
            }
            if ($scope.deviceInfo[i].model !== "" && $scope.deviceInfo[i].model !== null && $scope.deviceInfo[i].model !== undefined) {
                fieldsCompleted++;
            }
            if ($scope.deviceInfo[i].os !== "" && $scope.deviceInfo[i].os !== null && $scope.deviceInfo[i].os !== undefined) {
                fieldsCompleted++;
            }
            if ($scope.deviceInfo[i].os_version !== "" && $scope.deviceInfo[i].os_version !== null && $scope.deviceInfo[i].os_version !== undefined) {
                fieldsCompleted++;
            }
            if ($scope.deviceInfo[i].network_name !== "" && $scope.deviceInfo[i].network_name !== null && $scope.deviceInfo[i].network_name !== undefined) {
                fieldsCompleted++;
            }
            if ($scope.deviceInfo[i].total_memory !== "" && $scope.deviceInfo[i].total_memory !== null && $scope.deviceInfo[i].total_memory !== undefined) {
                fieldsCompleted++;
            }
            if ($scope.deviceInfo[i].total_space !== "" && $scope.deviceInfo[i].total_space !== null && $scope.deviceInfo[i].total_space !== undefined) {
                fieldsCompleted++;
            }
            $scope.deviceInfo[i].percent_complete = Math.ceil((fieldsCompleted / totalFields) * 100);
            fieldsCompleted = 0;
        }
    };

    $scope.makeImageUrl = function () {
        for (var i = 0; i < $scope.deviceInfo.length; i++) {
            $scope.deviceInfo[i].image_url = $scope.deviceInfo[i].os.toLowerCase();
        }
    };

    $scope.logout = function () {
        $scope.app.userPanel = false;
        nbAuth.logout();
    };

    $scope.removeDevice = function(device){
        $scope.deviceList = [];
        var r = window.confirm("Are you sure you want to delete this device ?");
        if (r === true) {
            userService.removeDevice(device.id).then(function(){
                _.each($scope.deviceInfo, function(value, key){
                    if(value.id === device.id){
                        delete $scope.deviceInfo[key];
                    }
                    else{
                        $scope.deviceList.push(value);
                    }
                });
                $scope.deviceInfo = $scope.deviceList;
                $scope.totalDevices = $scope.deviceInfo.length;
                $scope.updateDeviceScrollBar();
            });
        } else {

        }

    };

    $scope.updateDeviceScrollBar = function(){
        $scope.singleDeviceHeight = 180;
        $timeout(function(){
            if($scope.totalDevices>1){
                $(".device-info-area .ps-scrollbar-y").css("height", $scope.singleDeviceHeight/$scope.totalDevices+"px");
            }
        });
    };


});
