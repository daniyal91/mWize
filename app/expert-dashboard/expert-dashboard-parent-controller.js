angular.module('app').controller('ExpertDashboardParentCtrl',function($scope,$rootScope,socket,helperFunctions,ticketStatusEnum){

	$scope.currentTicketId = 0;
	$scope.tickets = {};
	$scope.ticketList = [];
	$scope.chat = {input: "", isActive:true, messages: []};
	$scope.isBot = false;
	$scope.userRole = $rootScope.user.role;
	$rootScope.expertRightPanelShow = false;

	$scope.setCurrentTicketId = function(currentTicketId){
		$scope.currentTicketId = currentTicketId;
	};

	$scope.getCurrentTicketId = function(){
		return $scope.currentTicketId;
	};

	$scope.addTicketObject = function(ticket){
		$scope.ticketList.push(ticket.id);
		$scope.tickets[ticket.id] = ticket;
		$scope.joinChat(ticket.id);
	};

	$scope.getTicketObject = function(ticketId){
		return $scope.tickets[ticketId];
	};

	$scope.panel = {collapsed:true};
	$scope.collapsePanel = function(){
		$scope.panel.collapsed=true;
	};

	$scope.expandPanel = function(){
		$scope.panel.collapsed=false;
	};

	$scope.requestFeedback = function(){
		//$scope.ticket.qid
		$scope.sendMessage('Great! So glad I was able to help. And with that I have just one last thing... was your question answered? If so, please click Yes below and I\'ll send you back to Oscar. Feel free to tell him how great I was. ;) [{"type":"feedback","data":"feedback"}]',"left");
	};

	$scope.sendMessage = function (message,direction) {
		console.log("sending message for ticket"+$scope.getCurrentTicketId());
		direction = (typeof direction === 'undefined')?'right':direction;
			if (message) {
					$scope.tickets[$scope.getCurrentTicketId()].comments.push({direction: direction, content: message});
					if ($scope.isBot) {
							socket.emit('processResponse', {msg: message, ticketId: $scope.currentTicketId});
					}
					else {
							socket.emit('message', {content: message, ticket_id: $scope.currentTicketId, user_id: $rootScope.user.user_id});
					}
					// $(".custom-chat-input").prop('disabled', true);
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
				$scope.tickets[$scope.getCurrentTicketId()].comments.push({direction: "left", content: $scope.chat.input});
					if ($scope.isBot) {
							socket.emit('processResponse', {msg: $scope.chat.input, ticketId: $scope.getCurrentTicketId()});
					}
					else {
							socket.emit('message', {content: $scope.chat.input, ticket_id:$scope.getCurrentTicketId(), user_id: $rootScope.user.user_id});
					}
			}
			$scope.chat.input = "";
			helperFunctions.scrollToBottom(100);
	};

	$scope.getAvailability = function(){

				// call available service
				$rootScope.isAvailable = true;
				$scope.changeAvailabilityStatus($rootScope.isAvailable);
	};

	$scope.updateAvailability = function(){

	};

	$scope.statusChanged = function(){
	 		
	 		$rootScope.isAvailable = !$rootScope.isAvailable;
	 	  $scope.changeAvailabilityStatus($rootScope.isAvailable);

			console.log($rootScope.isAvailable);
	};

	$scope.changeAvailabilityStatus = function(isAvailable){

		if(isAvailable){
	 				$rootScope.availabilityClass = '';
	 		}else{
	 				$rootScope.availabilityClass = 'active';
	 		}
	};

	$scope.changeTicketStatus = function(ticketId,newStatus){
			$scope.tickets[ticketId].ticketStatus = newStatus;
	};

	$scope.joinChat = function (ticketId) {
		socket.emit('join', {user:$rootScope.user,ticketId:ticketId});
		//socket.emit('checkPreviousMessages',ticketId);

		//$scope.$parent.ticket.subject = "a";
	};


	$scope.$on("$destroy", function handleDestroyEvent(event) {
		socket.removeAllListeners();
		// or something like
		// socket.removeListener(this);
	});

	socket.on('message', function (response) {

		console.log("Message received from customer: ",response);
		var isBot = typeof response.isBot !== 'undefined' ? response.isBot : $scope.isBot;
		response.direction = isBot ? "left" : "right";
		$scope.tickets[response.ticket_id].comments.push(response);

		if($scope.getCurrentTicketId() !== response.ticket_id){
				$scope.changeTicketStatus(response.ticket_id, ticketStatusEnum.NewComment);
				var ticket = $scope.ticketList.splice($scope.ticketList.indexOf(response.ticket_id), 1)[0];
				$scope.ticketList.unshift(ticket);
		}

		console.log($scope.ticketList.indexOf(response.ticket_id));
		helperFunctions.scrollToBottom(50);
		//$rootScope.$broadcast('CHANGE_QUESTION_STATUS', {comment: response});
		//$(".chat-box").animate({ scrollTop: $('.chat-box')[0].scrollHeight}, 500);
	});

	socket.on('noPreviousMessagesFound',function(ticketId){
		console.log("no previous msg found");
	});

	socket.on('joined', function (joined) {
		console.log('User joined ' + joined.byUserId);
	});

	socket.on('previousMessages',function(){
		//	$scope.loadChat();
	});

	socket.on("ticketResolved", function(){
		$scope.chat.isActive = false;
	});

	$scope.getAvailability();

});