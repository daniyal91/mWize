angular.module('app').controller('TicketDetailsCtrl', function ($scope, ticketService, ticketStatus, $stateParams, socket, $rootScope,$timeout,helperFunctions) {

	$scope.chat = {input: "", isActive:true, messages: []};
	$scope.isBot = false;
	$scope.expertJoined = false;
	$scope.userRole = $rootScope.user.role;

	$scope.ticketDetail = function () {
		var ticket = $stateParams;
		ticketService.resource.query({id: ticket.id}, function (ticketDetails) {
				$scope.ticket = ticketDetails;

				console.log("**$scope.ticket.status: "+$scope.ticket.status);
				if($scope.ticket.status==='resolved_by_user')
				{
					$scope.chat.isActive=false;
				}
				$scope.init(ticketDetails.id);
		});

		$scope.showTicketDetails = true;
		$scope.selectedTicket = ticket;
		$scope.requestFeedbackHide = false;
	};



	$scope.ticketDetail();


	$scope.init = function (ticketId) {
		socket.emit('join', {user:$rootScope.user,ticketId:ticketId});
		socket.emit('checkPreviousMessages',ticketId);
	};

	socket.on('noPreviousMessagesFound',function(ticketId){
		if(ticketId===$scope.ticket.id && $scope.ticket.status === 'waiting_for_expert')
		{
			$scope.sendWelcomeMessage();
		}
	});

	$scope.sendWelcomeMessage = function(){
		console.log("**** sendWelcomeMessage Innitiated");
		$timeout(function(){

			$scope.sendMessage("Hi, nice to meet you :). My name is "+$rootScope.user.first_name+" and I will be helping you solve your problem","left");
		},5000);
	};

	$scope.requestFeedback = function(){
		$scope.sendMessage('Great! So glad I was able to help. And with that I have just one last thing... was your question answered? If so, please click Yes below and I\'ll send you back to Oscar. Feel free to tell him how great I was. ;) [{"type":"feedback","data":"feedback"}]',"left");
		$scope.requestFeedbackHide = true;
	};

	socket.on('joined', function (joined) {
		console.log('User joined ' + joined.byUserId);
	});

	socket.on('previousMessages',function(params){
		var messages = params.replies;

		console.log("ON previous message");
		$scope.isBot = false;
		var messageObject = {
			msg: "",
			direction: "",
			isBot: ""
		};

		var isThisMyFirstReply = true;

		_.each(messages, function (value, key) {
			messageObject.msg = value.content;
			messageObject.isBot = value.is_bot;
			messageObject.userId = value.user_id;
			messageObject.createdAt = value.created_at;

			if(value.user_id===$rootScope.user.user_id)
			{
				isThisMyFirstReply=false;
			}

			if (messageObject.isBot) {
				$scope.chat.messages.push({direction: "left", msg: messageObject.msg, isBot: messageObject.isBot, createdAt: moment(messageObject.createdAt).calendar()});
			}
			else {
				if (messageObject.userId === $rootScope.user.user_id) {
					$scope.chat.messages.push({direction: "left", msg: messageObject.msg, isBot: messageObject.isBot, createdAt: moment(messageObject.createdAt).calendar()});
				}
				else {
					$scope.chat.messages.push({direction: "right", msg: messageObject.msg, isBot: messageObject.isBot, createdAt: moment(messageObject.createdAt).calendar()});
				}
			}
		});

		console.log("Current ticket status: "+$scope.ticket.status +" for ticketId: "+$scope.ticket.id);
		console.log("isThisMyFirstReply: "+isThisMyFirstReply);
		console.log("params.ticketId: "+params.ticketId);
		console.log("$scope.ticket.id: "+$scope.ticket.id );
		console.log("$scope.ticket.status: "+$scope.ticket.status);
		console.log("ticketStatus.waiting_for_expert:"+ticketStatus.waiting_for_expert);
		if(isThisMyFirstReply && params.ticketId===$scope.ticket.id && $scope.ticket.status === 'waiting_for_expert'){
			$scope.sendWelcomeMessage();
		}

		helperFunctions.scrollToBottom(500);
	});

	socket.on('message', function (response) {
			var isBot = typeof response.isBot !== 'undefined'?response.isBot:$scope.isBot;
			var direction = isBot?"left":"right";
			$scope.chat.messages.push({direction: direction, msg: response.msg, isBot: isBot});
			helperFunctions.scrollToBottom(50);
			//$(".chat-box").animate({ scrollTop: $('.chat-box')[0].scrollHeight}, 500);
	});

	$scope.sendMessage = function (message,direction) {
		direction = (typeof direction === 'undefined')?'right':direction;
			if (message) {
					$scope.chat.messages.push({direction: direction, msg: message});
					if ($scope.isBot) {
							socket.emit('ask', {msg: message, ticketId: $scope.ticket.id});
					}
					else {
							socket.emit('message', {msg: message, ticketId: $scope.ticket.id, userId: $rootScope.user.user_id});
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
					$scope.chat.messages.push({direction: "left", msg: $scope.chat.input});
					if ($scope.isBot) {
							socket.emit('ask', {msg: $scope.chat.input, ticketId: $scope.ticket.id});
					}
					else {
							socket.emit('message', {msg: $scope.chat.input, ticketId: $scope.ticket.id, userId: $rootScope.user.user_id});
					}
			}
			$scope.chat.input = "";
			helperFunctions.scrollToBottom(100);
	};

	socket.on('errorOnMessage',function(originalMessage){
		$scope.chat.messages.push({direction: "left", msg: originalMessage.msg, isBot:0});
	});
});
