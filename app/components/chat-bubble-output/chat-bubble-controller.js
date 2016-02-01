angular.module('app').controller('ChatBubbleCtrl', function ($scope, $rootScope,phoneService,phoneModelService, $window, $stateParams, ticketService, ticketStatus, socket, $location, $anchorScroll,$timeout,helperFunctions,mwizeModalService,nbAuth, userService, appConfig) {

	$scope.chat = {};
	$scope.chatParams = {showControls:true,
												disableControls:false};

	phoneService.resource.query(function(phoneData){
		$scope.chatParams.deviceList = phoneData;
		phoneModelService.resource.query(function(modelData){
			$scope.chatParams.modelList = modelData;
				userService.getAllOs().then(function (osData) {
					$scope.chatParams.osList = osData.data;

					$scope.chat.messages = [
					{direction:"right",msg:"Hello [{\"type\":\"button\",\"data\":[{\"label\":\"Yes\",\"text\":\"Yes\"},{\"label\":\"No\",\"text\":\"No\"}]}]",isBot:true},
					{direction:"left",msg:"Select Phone Device? [{\"type\":\"dropdown\",\"data\":{\"dataType\":\"device\",\"filter\":\"\"}}]"},
					{direction:"right",msg:"Select Phone Model? [{\"type\":\"dropdown\",\"data\":{\"dataType\":\"model\",\"filter\":\"iPhone\"}}]"},
					{direction:"left",msg:"Select Phone OS? [{\"type\":\"dropdown\",\"data\":{\"dataType\":\"os\",\"filter\":\"iPhone\"}}]"},
					{direction:"left",msg:"Rate [{\"type\":\"showStars\",\"data\":{\"dataType\":\"5\",\"filter\":\"\"}}]"}
					

					];

				});
		});
	});
	
	$scope.sendMessage = function(message){
		console.log("Message Output");
		console.log(message);
	};

});