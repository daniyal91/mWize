angular.module('app').controller('ExpertDashboardLeftCtrl',['$window','$rootScope','$scope','ticketService', 'ticketStatus','ticketStatusEnum','$timeout', function($window,$rootScope,$scope,ticketService, ticketStatus,ticketStatusEnum,$timeout){

	$scope.loadTickets = function () {

		// call a service
		ticketService.resource.query({status: "", page: 1, per_page: 100, role: 'expert', assignee_id: $rootScope.user.user_id}, function (data) {
			for (var i in data.tickets) {
				data.tickets[i].commentCount = 0;
				data.tickets[i].comments = [];
				//data.tickets[i].status = activeTicketsStatusEnum.Closed;
				data.tickets[i].by = data.tickets[i].ticket_creator || "no-chat-name";
				data.tickets[i].commentsFetched = false;
				data.tickets[i].ticketStatus = ticketStatusEnum.Closed;
				$scope.addTicketObject(data.tickets[i]);
			}
		});
	};

	$scope.loadTickets();

	$scope.openTicket = function (ticketId) {
		$rootScope.expertRightPanelShow = true;
		$scope.setCurrentTicketId(ticketId);
		//$scope.joinChat($scope.getCurrentTicketId());

		if($scope.getTicketObject(ticketId).commentsFetched){
			$rootScope.$broadcast('LOAD_TICKET_CHAT', {ticketId: ticketId, isOpened: true});
		}else{
			$scope.getTicketComments(ticketId,function(replies){
				$scope.$parent.tickets[ticketId].commentCount = replies.data.replies.length;
				$scope.$parent.tickets[ticketId].comments = replies.data.replies;
				$scope.$parent.tickets[ticketId].commentsFetched = true;
				$rootScope.$broadcast('LOAD_TICKET_CHAT', {ticketId: ticketId, isOpened: true});
			});
		}

			// Mark all tickets as closed
			_.each($scope.$parent.tickets,function(ticket){
					if(ticket.ticketStatus !== ticketStatusEnum.NewComment){
						ticket.ticketStatus = ticketStatusEnum.Closed;
					}
			});

			// Mark clicked ticket as opened
			$scope.$parent.tickets[ticketId].ticketStatus = ticketStatusEnum.Opened;
	};

	$scope.getTicketComments = function (ticketId,callback) {
		ticketService.getReplies(ticketId).then(function (obj) {
			callback(obj);
		});
	};

	$scope.changeQuestionStatus = function (ticketId, status) {
		/*$scope.getQuestion(ticketId, function (ticket) {
			ticket.status = status;
		});*/
		//$scope.tickets[$scope.getCurrentTicketId].
	};

	$scope.addCommentInQuestion = function (ticketId, comment) {
		$scope.getQuestion(ticketId, function (ticket) {
			comment.content = comment.msg;
			comment.ticket_id = comment.ticketId;
			comment.user_id = comment.userId;
			ticket.comments.push(comment);
			ticket.commentCount++;
		});
	};

	$scope.moveQuestionToTop = function (ticketId) {
		$scope.getQuestionIndex(ticketId, function (ind) {
			var i = $scope.questions.splice(ind, 1);
			$scope.questions.unshift(i[0]);
		});
	};

	$scope.getQuestion = function (ticketId, callback) {
		$scope.questions.forEach(function (i) {
			if (i.id === ticketId) {
				callback(i);
			}
		});
	};

	$scope.getQuestionIndex = function (ticketId, callback) {
		var ind = 0;
		$scope.questions.forEach(function (i) {
			if (i.id === ticketId) {
				return callback(ind);
			}
			ind++;
		});
	};

//	written Monday
	$scope.getAvailableTickets = function () {
		ticketService.getAvailableTickets().then(function(availableTickets){
			if(availableTickets.data.length){

				var availableTicket = availableTickets.data[0];
				var ticketAssignee = {assignee_id:$scope.user.user_id,status:ticketStatus.in_progress_by_expert,is_reading:true};
				ticketService.resource.update({id: availableTicket.id}, ticketAssignee, function () {
					
					//p.submitted = Math.round((((new Date().getTime()) - (new Date(i.created_at).getTime()))/1000)/60);
					availableTicket.commentCount = 0;
					availableTicket.comments = [];
					availableTicket.status = ticketStatus.in_progress_by_expert;//activeTicketsStatusEnum.Closed;
					availableTicket.by = availableTicket.ticket_creator_username || "no-chat-name";
					availableTicket.commentsFetched = false;
					$scope.$parent.tickets[availableTicket.id] = availableTicket;
					$scope.$parent.ticketList.push(availableTicket.id);
					//$scope.GetComments(availableTicket.id);
					$rootScope.$broadcast('NEW_TICKET_ASSIGNED', {ticketId: availableTicket.id});

				});
			}
			else{
				$window.alert("No Tickets Available");
			}
		});
	};

	$rootScope.$on('NEW_TICKET_ASSIGNED', function (event, obj) {
		$scope.joinChat(obj.ticketId);
		$scope.openTicket(obj.ticketId);

		$timeout(function () {
			$scope.sendMessage("Hi, nice to meet you :). My name is " + $rootScope.user.first_name + " and I will be helping you solve your problem", "left");
		}, 2000);
	});

	/*$rootScope.$on('CHANGE_QUESTION_STATUS', function (event, data) {
		//$scope.changeQuestionStatus(data.comment.ticketId, activeTicketsStatusEnum.NewComment);
		//$scope.addCommentInQuestion(data.comment.ticketId, data.comment);
		//$scope.moveQuestionToTop(data.comment.ticketId);
	});*/

}]);
