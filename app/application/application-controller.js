angular.module('app').controller('ApplicationCtrl',function($scope,$log,$timeout,nbAuth,$q,mwizeModalService,$rootScope,$state, userService, appConfig){
	$scope.app = {};
	$scope.app.authenticated = false;
	$scope.app.header = true;
	$scope.app.footer = true;
	$scope.app.sidebar = true;
	$scope.loginError = {invalidCredentials: false};
	$scope.isValidForm = false;
	$scope.app.userPanel = false;

	$scope.$state = $state;

	$scope.showControls = function(){
		$scope.app.header = true;
		$scope.app.footer = true;
		$scope.app.sidebar = true;
	};

	$scope.hideControls = function(){
		$scope.app.header = false;
		$scope.app.footer = false;
		$scope.app.sidebar = false;
		$log.info("hidecontrole");
	};

	$scope.logout = function(){
		nbAuth.logout();
	};

	var loginModalController = ['$scope','$modalInstance','resolvedData', '$timeout',function ($scope, $modalInstance,resolvedData,$timeout) {
		$scope.credentials = {email:'',password:''};
		$scope.loginError = {invalidCredentials: false};

		// Email passed from loginModal => source: generated login link on email
		if(resolvedData.email){
			$scope.credentials.email = resolvedData.email;
      // trigger event manually for input field(s), using validation-directive
      $timeout(function(){
        $(".input-login-email").blur();
      },1000);
		}

    var passwordE = $('#exampleInputPassword1')[0];
    console.log("password element: ",passwordE);

    $scope.passEmpty = false;


		$scope.login = function(credentials){
			var deferred = $q.defer();
			nbAuth.login(credentials)
				.then(function(res){
					console.log("logging res");
					console.log(res);
					if(res.status===200)
					{
						deferred.resolve(res);
						$scope.loginError.invalidCredentials = false;
						$scope.ok();
					}
					else if(res.status===401)
					{
						console.log("User not authorized");
						deferred.reject(res);
						$scope.loginError.invalidCredentials = true;
					}
				},
				function(res){
					console.log("user has some issues logging into the account");
					deferred.reject(res);
				});
			return deferred.promise;
		};

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

		$scope.forgotPassword = function(){
			$scope.cancel();
			$state.go('public.forgot-password');
		};

		$scope.openConsumerSignupModal = function(){
			mwizeModalService.open('app/ask-a-specialist/consumer-signup/_consumer-signup-modal.html',{},'ConsumerSignupCtrl','custom-modal').then(function(data){ 
				console.log('signup modal started');
				$scope.openLoginModal();
			}); 
		};
	
		$scope.consumerSignup = function(){
			$scope.cancel();
			$scope.openConsumerSignupModal();
		};

		$scope.openLoginModal = function(){
			mwizeModalService.open('app/application/_login-popup.html',{},loginModalController,'custom-modal').then(function(data){
			},function(){
				console.log("Closed");
			});
		};

    $scope.$watch('credentials.password',function(){
      var inputPass = document.getElementById("exampleInputPassword1");
      if($scope.credentials.password===undefined){
        inputPass.style.borderColor = "red";
      }
      else {
        inputPass.style.borderColor = "";
      }
    });

	}];

	$scope.loginModal = function(obj){
			mwizeModalService.open('app/application/_login-popup.html',obj? obj:{},loginModalController,'custom-modal').then(function(data){
			},function(){
				console.log("Closed");
			});
	};

	$scope.openConsumerSignupModal = function(){
		mwizeModalService.open('app/ask-a-specialist/consumer-signup/_consumer-signup-modal.html',{type: 'signup'},'ConsumerSignupCtrl','custom-modal').then(function(data){ 
			console.log('signup modal started');
			$scope.loginModal();
		}); 
	};

	$scope.openUserPanel = function(){
		$scope.app.userPanel = !$scope.app.userPanel;
		userService.getUserAvatar().then(function (userAvatar) {
			$rootScope.$broadcast("updateAvatar", userAvatar.data.name);
		});

		 $timeout(function(){
		    $(".secondary-scroll .ps-scrollbar-y").css("height","50px");
		  },500);
	};

	$rootScope.$on('LOGIN_OPEN_WITH_EMAIL',function(event,data){
				$scope.loginModal({email: data});

	});

});