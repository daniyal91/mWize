angular.module('app').controller('UserProfileCtrl', function ($scope, $rootScope, resolvedData, userService, $modalInstance, nbAuth, avatarService, appConfig, $upload, $timeout) {


  $scope.isValidForm = true;
  $scope.passwordModal = false;
  $scope.showAllFielsError = false;
  $scope.passwordErrMessage = "";

  $scope.init = function () {
    $scope.userPassword = {
        password: "",
        confirm_password: "",
        old_password: ""
    };
    userService.resource.query({id: $rootScope.user.user_id}, function (data) {
      $rootScope.user.first_name = data.first_name;
      $rootScope.user.last_name = data.last_name;
      $rootScope.user.username = data.username;
      $rootScope.user.username_temp = data.username;
    });

    if ($rootScope.user.first_name === null) {
      $rootScope.user.first_name = '';
    }
    if ($rootScope.user.last_name === null) {
      $rootScope.user.last_name = '';
    }
    if ($rootScope.user.username === null) {
      $rootScope.user.username = '';
    }

    $scope.user.fullName = $rootScope.user.first_name + " " + $rootScope.user.last_name;

    avatarService.getAvatars().then(function (avatars) {
      $scope.avatars = avatars.data;
      $scope.avatars.rootUrl = appConfig.protocol + appConfig.apiHost;
	    userService.getUserAvatar().then(function (userAvatar) {
		    $scope.userAvatar = userAvatar.data.name;
	    });
    });

    // trigger event manually for input field(s), using validation-directive
    $timeout(function(){
      $(".user-profile-email").blur();
      $(".user-profile-chatname").blur();
    },1000);

  };

  $scope.init();

  $scope.updateUserProfile = function () {

    if($scope.passwordModal===true){
      console.log("user new data:",$scope.userPassword);


      if((this.validComparison && ($scope.userPassword.confirm_password!=="" && $scope.userPassword.confirm_password!==null && $scope.userPassword.confirm_password!==undefined))){
        $scope.showAllFielsError = false;
        userService.updateUserPassword($scope.userPassword).then(function (response) {
          if (response.status === 200) {
              $scope.userPassword = {
                  password: "",
                  confirm_password: "",
                  old_password: ""
              };
            $scope.isValidForm = true;
            $scope.passwordModal = false;
          }
          else{
            $scope.showAllFielsError = true;
            $scope.passwordErrMessage = "Old password does not match the one in our record.";
          }
        }, function(response){
          if (response.status !== 200) {
            $scope.showAllFielsError = true;
            $scope.passwordErrMessage = "Old password does not match the one in our record.";
          }
        });
        console.log("");
      }
      else{
        $scope.showAllFielsError = true;
        $scope.passwordErrMessage = "Please fill all the required fields first.";
      }
    }
    else if(this.isValidForm) {
      $scope.userObj = {};

      if ($scope.user.fullName) {
        var userFullName = $scope.user.fullName.split(" ");
        $scope.userObj.first_name = userFullName[0];
        $scope.userObj.last_name = userFullName[1];
        $rootScope.user.first_name = userFullName[0];
        $rootScope.user.last_name = userFullName[1];
      }
      else {
        $scope.userObj.first_name = "";
        $scope.userObj.last_name = "";
        $rootScope.user.first_name = "";
        $rootScope.user.last_name = "";
      }

      $scope.userObj.email = $scope.user.email;
      $scope.userObj.username = $scope.user.username_temp;

      if ($scope.userPassword.password) {
        $scope.userObj.password = $scope.userPassword.password;
      }
      console.log("user new data:",$scope.userObj);
      userService.updateUser($scope.userObj).then(function (response) {
        if (response.status === 200) {
          nbAuth.updateUserCookies($scope.userObj);
          $rootScope.user.username = $scope.user.username_temp;
          $modalInstance.close();
        }
      });
    }

  };

  $scope.avatarSelected = function (avatarSelected) {
    userService.updateUser({avatar_id: avatarSelected.id}).then(function (response) {
      if (response.status === 200) {
        $rootScope.$broadcast("updateAvatar", avatarSelected.name);
        $scope.userAvatar = avatarSelected.name;
      }
    });
  };

  $scope.onCustomAvatarSelect = function ($files) {
    var uploadedAvatar = $files[0];
    var validFileTypes = ['image/jpeg', 'image/png'];
    var validFileSize = 1024 * 1024;
    if ($.inArray(uploadedAvatar.type, validFileTypes) !== -1) {
      if (uploadedAvatar.size < validFileSize) {
        userService.uploadUserAvatar(uploadedAvatar).then(function (response) {
          if (response.status === 200) {
            $scope.userAvatar = response.data.avatar;
	          $rootScope.$broadcast("updateAvatar", $scope.userAvatar);
          }
          else {
            window.alert("Unable to upload Avatar. Please Check your network connection.");
          }
        });
      }
      else {
        window.alert("file is big");
      }
    }
    else {
      window.alert("Image type must be JPEG or PNG");
    }
  };

  $scope.openPasswordModal = function(){
    $scope.passwordModal = true;
      $scope.userPassword = {
          password: "",
          confirm_password: "",
          old_password: ""
      };
    $scope.isValidForm = true;
    $scope.showAllFielsError = false;
  };

  $scope.closePasswordModal = function(){
      $scope.userPassword = {
          password: "",
          confirm_password: "",
          old_password: ""
      };
    $scope.passwordModal = false;
    this.validComparison = true;
    $scope.showAllFielsError = false;
  };

  $scope.close = function () {
    $modalInstance.close();
  };

	$scope.$on("updateAvatar", function (event, avatarName) {
		$scope.userAvatar = avatarName;
	});

});
