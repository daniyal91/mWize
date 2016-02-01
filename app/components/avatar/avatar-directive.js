angular.module('app').directive('avatarDirective', function(mwizeModalService,$rootScope,avatarService,appConfig,nbAuth,$upload,userService) {
	var avatars = [];
	return {
		restrict: 'A',
		scope:{
			userRole:'@'
		},
		link: function(scope, element, attrs, fn) {
			if ($rootScope.user.user_id) {
				userService.resource.query({id: $rootScope.user.user_id}, function (data) {
					var guestUserAvatar = data.avatar;
					if (guestUserAvatar.id !== 1) {
						$('.round-img').css("background-image", "url('" + appConfig.protocol + appConfig.apiHost + "/avatars/" + data.avatar.name + "')");
					}
					else {
						if($rootScope.user.role.name === "customer")
							{
								$('.chat-img').css("background-image", "url('/assets/images/avatar.png')");
							}
							else
							{
								$('.chat-img').css("background-image", "url('/assets/images/avatar-blank.png')");
							}
					}
				});
			}

			scope.customAvatar = {id:'', name:'', customAvatar:''};

			scope.changeAvatar = function(event){
				avatarService.getAvatars().then(function(data){
					avatars = data.data.files;

					var dataIn = {user:$rootScope.user, files:avatars, rootUrl:appConfig.protocol+appConfig.apiHost, customAvatar:scope.customAvatar};

					var controller = ['$scope','$modalInstance','resolvedData',function ($scope, $modalInstance,resolvedData) {

						$scope.avatarSelected = function(file){
							$scope.file = file;
							$scope.imageUrl = appConfig.protocol+appConfig.apiHost+'/avatars/'+$scope.file.name;
							$scope.selectedFile = $scope.file.name;
							// file = file.replace(/avatars/, "");
						};

						$scope.selectAvatar = function() {
							if(dataIn.customAvatar.customAvatar === true)
							{
								avatarService.deleteCustomAvatar(dataIn.customAvatar).then(function(data){
								});
							}
							userService.resource.update({id:$rootScope.user.user_id},{avatar_id:$scope.file.id},function(data){
								$('.chat-img').css("background-image", "url('"+$scope.imageUrl+"')");
								$scope.customAvatar = {id: $scope.file.id, name: $scope.file.name, customAvatar: $scope.file.custom_avatar};
								$rootScope.$broadcast("updateAvatar", $scope.file.name);
								// $scope.ok();
							});
							$scope.ok();
						};

						// $scope.onFileSelect = function($files) {
						//   for (var i = 0; i < $files.length; i++) {
						//     var file = $files[i];
						//     $scope.upload = $upload.upload({
						//       url: nbAuth.getHost()+'users/'+$rootScope.user.user_id+'/upload_avatar',
						//       file: file,
						//     }).then(fileSuccess);
								
						//   }
						// };

						$scope.onFileSelect = function($files) {
							for (var i = 0; i < $files.length; i++) {
								var file = $files[i];
								var validFileTypes = ['image/jpeg', 'image/png'];
								var validFileSize = 1024 *1024; // 1MB
								if ($.inArray(file.type, validFileTypes) !== -1)
								{
									if(file.size < validFileSize)
									{
										$scope.upload = $upload.upload({
											url: nbAuth.getHost()+'/users/'+$rootScope.user.user_id+'/upload_avatar',
											file: file,
										}).success(uploadSuccess).error(uploadFailure);
									}
									else
									{
										// console.log("file is big");
										window.alert("file is big");
									}
								}
								else
								{
									// console.log("Image type must be JPEG or PNG");
									window.alert("Image type must be JPEG or PNG");
								}
								
							}
						};

						function uploadSuccess(data){
							$('.chat-img').css("background-image", "url('"+appConfig.protocol+appConfig.apiHost+data.path+"')");
							$scope.customAvatar = {id: data.avatar_id, name: data.avatar, customAvatar: data.type};
							$scope.ok();
						}

						function uploadFailure(data){
							window.alert('Please upload a valid image');
						}

						// function fileSuccess(data){
						//   $('.chat-img').css("background-image", "url('"+appConfig.apiHost+data.data.path+"')");
						//   // var customAvatarName = data.data.path.replace("/avatars/", "");
						//   // var customAvatar = {name:customAvatarName,custom_avatar:true};
						//   // avatarService.createCustomAvatar(customAvatar).then(function(data){
						//   //   $scope.customAvatarId = {id: data.data.id};
						//   //   $scope.ok();
						//   // });
						//   $scope.customAvatarId = {id: data.data.avatar_id};
						//   $scope.ok();
						// }

						$scope.removeAvatar = function() {
							userService.resource.update({id:$rootScope.user.user_id},{avatar_id:null},function(data){
								$('.chat-img').css("background-image", "url('/assets/images/avatar.png')");
								avatarService.deleteCustomAvatar(dataIn.customAvatar).then(function(data){
									$scope.ok();
								});
							});
						};

						$scope.closeChooseAvatarModal = function(){
							$scope.cancel();
						};

						$scope.data = resolvedData;
						$scope.ok = function () {
							$modalInstance.close({in:$scope.data,out:this});
						};

						$scope.cancel = function () {
							$modalInstance.dismiss('cancel');
						};

							if(nbAuth.isAuthenticated() && !$rootScope.user.is_guest)
							{
								$scope.loggedIn = true;
							}
							else
							{
								$scope.loggedIn = false;
							}

					}];

					mwizeModalService.open('app/components/avatar/avatar-directive.html', dataIn,controller,'custom-modal').then(function(data){
						if(data.out.customAvatar)
						{
							scope.customAvatar.id = data.out.customAvatar.id;  
							scope.customAvatar.name = data.out.customAvatar.name;  
							scope.customAvatar.customAvatar = data.out.customAvatar.customAvatar;  
						}
					});
				});
			};

			var validRoles = ['customer','guest'];
			if(typeof scope.userRole !== 'undefined' && $.inArray(scope.userRole, validRoles) !== -1)
			{
				element.on('click', scope.changeAvatar);	
			}

			
		}
	};
});