angular.module('app').controller('AskASpecialistCtrl', function ($scope, $rootScope, $window, $stateParams, ticketService, ticketStatus, socket, $location, $anchorScroll,$timeout,helperFunctions,mwizeModalService,nbAuth, userService, appConfig, phoneService, phoneModelService, deviceInfoService) {

	console.log("Running Controller Ask A Specialist");

	$scope.chatParams = {showControls:true,
		disableControls:false,
		showStars : true};
	$scope.chat = {input: "", isActive:true, messages: []};
	$scope.isBot = true;
	$scope.isBotTyping = false;
	$scope.expertJoined = false;
	$scope.expertUser = [];
	$scope.showRelatedArticlesWindow = false;
	$scope.userRole = $rootScope.user.role;
	$scope.justRated = false;

	ticketService.resource.query({id: $stateParams.id}, function (ticketDetails) {
		console.log("ticket details");
		console.log(ticketDetails);
		//console.log(data);
		$scope.isBot = ticketDetails.is_bot;
		$scope.ticket = ticketDetails;//{title: ticketDetails.subject, id: $stateParams.id};
		
		if($scope.ticket.status==='resolved_by_user')
		{
			$scope.chat.isActive=false;
			$scope.chatParams.showStars=false;
		}
		phoneService.resource.query(function(phoneData) {
			$scope.chatParams.deviceList = phoneData;
			phoneModelService.resource.query(function (modelData) {
				$scope.chatParams.modelList = modelData;
				userService.getAllOs().then(function (osData) {
					$scope.chatParams.osList = osData.data;
					phoneService.getAllOsVersion().then(function(osVersionData){
						$scope.chatParams.osVersionList = osVersionData.data;
						deviceInfoService.getAllCarriers().then(function(operators){
							$scope.chatParams.operatorList = operators.data;
							userService.getUserDevices().then(function(userDevicesProfile){
								if(userDevicesProfile.data.length){
									$scope.chatParams.userDeviceProfileList = userDevicesProfile.data;
								}
								$scope.init($scope.ticket.id);
							});
						});
					});
				});
			});
		});

	});

	(function(){
		if(nbAuth.isAuthenticated && !$rootScope.user.is_guest) {
			userService.getUserDevices().then(function (devices) {
				$rootScope.user.deviceCount = devices.data.length;
			});
		}
	})();

	$scope.init = function (ticketId) {

		//console.log("init called with user_id: " + $rootScope.user.user_id);
		//console.log("userId:"+$rootScope.user.user_id+" is joining ticket:"+ticketId);
		socket.emit('join', {user:$rootScope.user,ticketId:ticketId});
		console.log("Checking previous messages for ticket:"+ticketId);
		socket.emit('checkPreviousMessages',ticketId);

		//$scope.displayMessage({msg:"check out these articles <a href='javascript:;' ng-click='showRelatedArticles()'>click here</a>"});
	};

	$scope.runCommand = function(command){
		console.log("Received Command: "+command);
		if(command==='botDoneSignup' || command==='botDone')
		{
			if(command==='botDoneSignup')
			{
				// call signup modal here
				if(!nbAuth.isAuthenticated())
				{
					$scope.consumerSignupModalOpen();
				}else if(nbAuth.isAuthenticated())
				{
					if($rootScope.user.is_guest)
					{
						$scope.consumerSignupModalOpen();
					}
				}
			}
			//console.log("Current ticket status when bot is about to done :"+$scope.ticket.status);
			if($scope.ticket.status==='open')
			{
				socket.emit('re:processTicket',{ticket:$scope.ticket,userId:$rootScope.user.user_id});
				$scope.ticket.status = 'waiting_for_expert';
				ticketService.resource.update({id:$scope.ticket.id},{is_bot: 0,status:ticketStatus.waiting_for_expert});
			}
		}
		else if(command === 'showRelatedArticles')
		{
			$scope.toggleRelatedArticles();
		}
		else if(command === 'signup')
		{
			console.log("show signup modal here");
		}
		else if(command === 'requestFeedback')
		{
			// User Accepted to give ratings at this point ticket status should be closed.
			$(".custom-chat-input").prop('disabled', true);
			$scope.chat.isActive=false;
			$scope.ticket.status = 'resolved_by_user';
			$scope.justRated = true;
			ticketService.resource.update({id:$scope.ticket.id},{status:ticketStatus.resolved_by_user});
			$scope.expertFeedbackModalOpen();
		}
		else if(command === 'showStars')
		{
			if($scope.ticket.status!=='resolved_by_user')
			{
				$scope.chatParams.showStars = true;
			}

			if($scope.justRated)
			{
				$scope.chatParams.showStars = true;
			}
		}
	};

	$scope.ratingGiven = function(rating){
		console.log("Rating provided");
		$scope.showStars=false;
		$scope.displayMessage({content:"Much appreciated!"});
		$scope.isBot=false;
		$scope.sendMessage("I have rated "+rating+" stars!");
	};

	$scope.toggleRelatedArticles = function()
	{
		$scope.showRelatedArticlesWindow = !$scope.showRelatedArticlesWindow;
		$rootScope.clearTimer();
	};

	$scope.expertFeedbackModalOpen = function(){
		// Instead of opening a modal the bot will ask the user to give ratings thus lets 
		// wake up the bot to further question the user.
		$scope.isBot=true;
		socket.emit('askMeForRatings',{ticketId:$scope.ticket.id,expertUser:$scope.expertUser,userId:$rootScope.user.user_id});
		//mwizeModalService.open('app/ask-a-specialist/expert-feedback/_expert-feedback-modal.html',{ticket_id:$scope.ticket.id,by_user_id:$rootScope.user.user_id,for_user_id:$scope.expertUser.user_id},'ExpertFeedbackCtrl','custom-modal').then(function(data){}); 
	};

	$scope.consumerSignupModalOpen = function(){

		console.log($scope.ticket.status);
		if($scope.ticket.status === 'open'){
			mwizeModalService.open('app/ask-a-specialist/consumer-signup/_consumer-signup-modal.html',{},'ConsumerSignupCtrl','custom-modal').then(function(data){
				console.log('signup modal started');
				$scope.loginModal();
			});
		}
  };

	$scope.botInit = function (ticketId) {

		if (!$rootScope.user.is_guest) {

			userService.getUserDevices().then(function(userDevices){
				console.log(userDevices.data);
				if(userDevices.data.length)
				{
					$scope.hasDevices = "1";
				}
				else{
					$scope.hasDevices = "";
				}
				socket.emit("setUserVariables", {user: $rootScope.user, ticketId: ticketId, hasDevices:$scope.hasDevices});
			});
		}
		else {
			socket.emit('botInit', {userId: $rootScope.user.user_id, ticketId: ticketId, title: $scope.ticket.subject, isGuest: $rootScope.user.is_guest});
		}
	};
  
	socket.on('noPreviousMessagesFound',function(ticketId){
		console.log("noPreviousMessagesFound for ticketId"+ticketId + "$scope.ticketId:"+$scope.ticket.id);
		
		if(ticketId===$scope.ticket.id)
		{
			if($scope.ticket.status!=='resolved_by_user')
			{
					$scope.botInit(ticketId);
			}
		}
	});

	socket.on("userVariablesAck", function(ticketId){
		console.log("Emiting bot init with userId:"+$rootScope.user.user_id+" and ticketId:"+$scope.ticket.id);
		socket.emit('botInit', {userId: $rootScope.user.user_id, ticketId: ticketId, title: $scope.ticket.subject, isGuest: $rootScope.user.is_guest});
	});

	socket.on('joined', function (data) {

		console.log("Expert Joined Below:");
		console.log(data);

		$scope.expertUser = data.user;

		if($scope.ticket.status==='waiting_for_expert')
		{
			// Expert Accepted the ticket at this point ticket status should be in_progress_by_expert.
			$scope.ticket.status = 'in_progress_by_expert';
			ticketService.resource.update({id:$scope.ticket.id},{status:ticketStatus.in_progress_by_expert});
			socket.emit('runExpertHandshake',{ticketId:$scope.ticket.id,expertUser:$scope.expertUser});
		}

		$scope.expertJoined = true;
		$scope.isBot = false;
	});

	socket.on('previousMessages',function(params){
		var messages = params.replies;
		console.log("ON previous message");
		//$scope.isBot = false;

		/*_.each($scope.tickets[$scope.currentTicketId].comments,function(comment,i){
			$scope.tickets[$scope.currentTicketId].comments[i].createdAt = moment(comment.createdAt).calendar();
			if (comment.is_bot) {
				$scope.tickets[$scope.currentTicketId].comments[i].direction = "left";
			}
			else
			{
				if (comment.user_id === $rootScope.user.user_id) {
					$scope.tickets[$scope.currentTicketId].comments[i].direction = "left";
				}
				else
				{
					$scope.tickets[$scope.currentTicketId].comments[i].direction = "right";
				}
			}
		});*/
		var messageObject = {
			content: "",
			direction: "",
			is_bot: ""
		};
		_.each(messages, function (messageObject, key) {
			var direction = "left";
			if (messageObject.is_bot) {
				direction = "left";
			}
			else {
				if (messageObject.user_id === $rootScope.user.user_id) {
					direction = "right";
				}
				else {
					direction = "left";
				}
			}

			messageObject.direction = direction;

			$scope.chat.messages.push(messageObject);
		});

		$timeout(function(){
			$(".custom-chat-input").prop('disabled', true);
		}, 500);
		helperFunctions.scrollToBottom(50);
	});

	socket.on('message', function (response) {
		console.log("** " + response.content);
		if($scope.isBot)
		{
			$timeout(function(){
				$scope.isBotTyping = true;
				helperFunctions.scrollToBottom(20);

				$timeout(function(){
					$scope.isBotTyping = false;
					$scope.displayMessage(response);
				},helperFunctions.getRandomInt(1500,2500));
			},helperFunctions.getRandomInt(500,1000));
		}else{
			$scope.displayMessage(response);

			if($scope.showRelatedArticlesWindow)
				{
					$scope.$broadcast('NEW_MESSAGE_ON_RELATED_ARTICLES',{status:"new msg"});
				}
		}
	});

	socket.on('errorOnMessage',function(originalMessage){
		$scope.chat.messages.push({direction: "right", content: originalMessage.content, is_bot:0});
	});

	$scope.displayMessage = function(response){
		//var isBot = typeof response.is_bot !== 'undefined'?response.is_bot:$scope.isBot;
		response.direction = "left";
		$scope.chat.messages.push(response);
		helperFunctions.scrollToBottom(20);
	};

	$scope.sendMessage = function (message) {
		if (message) {
			if (typeof message === 'string') {
				$scope.chat.messages.push({direction: "right", content: message});
				if ($scope.isBot) {
					socket.emit('processUserResponse', {message: message, ticketId: $scope.ticket.id, userId: $rootScope.user.user_id});
				}
				else {
					socket.emit('message', {content: message, ticket_id: $scope.ticket.id, user_id: $rootScope.user.user_id});
				}
			}
			else if (typeof message === 'object') {
				$scope.chat.messages.push({direction: "right", content: message.message});
				message.ticketId = $scope.ticket.id;
				message.userId = $rootScope.user.user_id;
				if(message.type === 'userDeviceProfile'){
						socket.emit('setUserDeviceProfile', {userDevice: message.selectObj, ticketId: $scope.ticket.id, userId: $rootScope.user.user_id});
				}

				$timeout(function(){
					socket.emit('processUserResponse', {message: message.message, ticketId: $scope.ticket.id, userId: $rootScope.user.user_id});
				}, 500);

			}
			$(".custom-chat-input").prop('disabled', true);
		}
		else {
			if($scope.chat.input.trim().length < 1){
				return;
			}
			else if ($scope.chat.input.trim().length > 250) {
				$scope.chat.input = $scope.chat.input.substr(0, 250);
			}

			// added this line to cut down crappy lengthy messages.
			$scope.chat.input = helperFunctions.strSplit( $scope.chat.input,55);

      console.log("Sending message: " + $scope.chat.input);
      $scope.chat.messages.push({direction: "right", content: $scope.chat.input});
      if ($scope.isBot) {
        console.log("Sending to bot");
	      socket.emit('processUserResponse', {message: $scope.chat.input, ticketId: $scope.ticket.id, userId: $rootScope.user.user_id});
      }
      else {
	      console.log("Sending to expert");
        socket.emit('message', {content: $scope.chat.input, ticket_id: $scope.ticket.id, user_id: $rootScope.user.user_id});
      }
    }
    $scope.chat.input = "";
    helperFunctions.scrollToBottom(20);
  };

	$scope.$on("$destroy", function handleDestroyEvent(event) {
		socket.removeAllListeners();
		// or something like
		// socket.removeListener(this);
		socket.emit('ticketRead', {ticketId: parseInt($scope.ticket.id), userId: $rootScope.user.user_id, ticketIn: false});
	});

	$scope.$on("updateAvatar", function (event, avatarName) {
		$('.round-img').css("background-image", "url('" + appConfig.protocol + appConfig.apiHost + "/avatars/" + avatarName + "')");
	});
});