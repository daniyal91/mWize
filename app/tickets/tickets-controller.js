angular.module('app').controller('TicketsCtrl',function($scope,$rootScope,$sanitize,mwCookies,$http,$log,nbAuth,mwizeModalService,$state,ticketService,userService,$upload,socket,appConfig,$stateParams,ticketStatus) {

	$scope.showTicketDetails = false;
	$scope.page = {current: 1, total_items: 0, items_per_page: 30};
	$scope.userRole = mwCookies.get("role");
	$scope.user = $rootScope.user;
	$scope.newTicket = {};
	$scope.newTicket.newReply = "";
	$scope.newTicket.totalReplies = 0;
	$scope.replyUser = "";
	$scope.collaborationQueue = [];
	$scope.collaboratorCheck = false;
	$scope.ticketsAvailable = 0;
	$scope.replies = [];
	var isPreviewCollaborationQueue = false;
	var isPreviewTicketQueue = true;
	var ticketsReturned = [];

	$scope.getTickets = function(status){
		$scope.showTickets('');
		$scope.sidebarFilter = 'mine';
		$scope.getAvailableTicketsCount();
		userService.resource.query({type: "expert"}, function(data){
			$scope.expertUsers = data.users;
		});
	};

	$scope.getAvailableTicketsCount = function(){
		ticketService.resource.query({status:'open'},function(data){
			$scope.ticketsAvailable = data.count;
		});
	};

	$scope.asigneeModal = function(ticket) {
		var dataIn = {expertUsers: $scope.expertUsers, ticket: ticket};
		var ticketAssignee = {};
		mwizeModalService.open('app/tickets/assign-expert.html', dataIn).then(function(data){
			if (data.out.selectedExpert === undefined)
			{
				ticketAssignee = {assignee_id: null,status:"open",is_reading:false};
			}
			else 
			{
				ticketAssignee = {assignee_id: data.out.selectedExpert.id,status:ticketStatus.waiting_for_expert,is_reading:false};
			}
			ticketService.resource.update({id: data.in.ticket.id}, ticketAssignee, function(){
				for (var x in $scope.tickets) 
				{
					if ($scope.tickets[x].id === data.in.ticket.id)
					 {
						if (data.out.selectedExpert === undefined)
						{
							$scope.tickets[x].ticket_assigned_to = 'Unassigned';
							// $scope.changeStatus(data.in.ticket,0);
							$scope.changeStatus(data.in.ticket,ticketStatus.open);
							$scope.tickets.pop(data.in.ticket);
						}
						else
						{
							$scope.tickets[x].ticket_assigned_to = data.out.selectedExpert.email;
							// $scope.changeStatus(data.in.ticket,3);
							$scope.changeStatus(data.in.ticket,ticketStatus.waiting_for_expert);
						}
					}
				}
				$scope.showTickets('');
				$scope.getAvailableTicketsCount();
			});
		}, function () {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};

	$scope.changeStatus = function(selectedTicket, status){
		var newStatus = {status: status};
		ticketService.resource.update({id: selectedTicket.id}, newStatus, function(data){
			selectedTicket.status = ticketService.setStatus(status);
		});
	};

	$scope.showTickets = function(type){
		ticketsReturned = [];
		$scope.showTicketDetails = false;

			if ($scope.userRole.name === 'expert') {
					ticketService.resource.query({status: type, page: 1, per_page: 100, role: $scope.userRole.name, assignee_id: $scope.user.user_id}, function (data) {
							$scope.tickets = data.tickets;
							$scope.totalTickets = data.count;
							$scope.page.total_items = data.count;
							$scope.sidebarFilter = type;
							$scope.page.current = 1;
					});
			}
			else {
					ticketService.resource.query({status: type, page: 1, per_page: 100, role: $scope.userRole.name, user_id: $scope.user.user_id}, function (data) {
							$scope.tickets = data.tickets;
							$scope.totalTickets = data.count;
							$scope.page.total_items = data.count;
							$scope.sidebarFilter = type;
							$scope.page.current = 1;
					});
			}
	};

	$scope.sort_by = function(predicate){
		$scope.predicate = predicate;
		$scope.reverse = !$scope.reverse;
	};

	$scope.getAllReplies = function(){
		return ticketService.getReplies($scope.selectedTicket.id).then(function(data){
			$scope.replies = data.data.replies;
			for(var x in $scope.replies)
			{
				$scope.replies[x].content = $scope.replies[x].content.replace(/\[(.*?)\]$/, "");
			}
			$scope.newTicket.totalReplies = data.data.replies.length;
		});
	};

	$scope.onFileSelect = function($files){
		for (var i = 0; i < $files.length; i++) {
			var file = $files[i];
			$scope.upload = $upload.upload({
				url: appConfig.apiURL + 'replies/upload_file',
				file: file
		}).then(fileProgress,fileSuccess);
		}
	};

	function fileProgress(evt){
		console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
	}

	function fileSuccess(data){
		$scope.attachment_id = data.id;
		console.log(data);
	}

	$scope.openAssignTicketModal = function(ticket){
		var dataIn = {selectedTicket:ticket,replies:$scope.replies};
		var ticketAssignee = {assignee_id:$scope.user.user_id,status:ticketStatus.waiting_for_expert,is_reading:true};
			mwizeModalService.open('app/tickets/assign-ticket.html', dataIn).then(function(dataOut){
					if (dataOut) {
						ticketService.resource.update({id: dataOut.in.selectedTicket.id}, ticketAssignee, function () {
							$scope.tickets.push(dataOut.in.selectedTicket);
							for (var x in $scope.tickets) {
								if ($scope.tickets[x].id === dataOut.in.selectedTicket.id) {
									$scope.tickets[x].ticket_assigned_to = $scope.user.email;
									$scope.tickets[x].ticket_assignee_id = $scope.user.user_id;
									$scope.tickets[x].assignee_id = $scope.user.user_id;
									$scope.tickets[x].created_at = moment(dataOut.in.selectedTicket.created_at).format("DD MMM hh:mm A");
									// $scope.changeStatus(dataOut.in.selectedTicket, 3);
									$scope.changeStatus(dataOut.in.selectedTicket, ticketStatus.waiting_for_expert);
									$scope.totalTickets = $scope.totalTickets + 1;
									$scope.page.total_items = $scope.totalTickets;
								}
							}
							$scope.getAvailableTicketsCount();
						});
					}
					else {
							var ticketAssigneeOnClose = {assignee_id: null, status: "open", is_reading: false};
							ticketService.resource.update({id: dataIn.selectedTicket.id}, ticketAssigneeOnClose, function () {
							});
					}
			},function(expertResponse){
				var ticketAssignee = {assignee_id:null,status:"open",is_reading:false};
				ticketService.resource.update({id: dataIn.selectedTicket.id}, ticketAssignee, function(){
					if(expertResponse === 'cancel'){
						$scope.getMore(dataIn.selectedTicket.id);
					}
					$scope.getAvailableTicketsCount();
				});
			});
	};

	$scope.getMore = function(ticketid){
		var check = 0;
		var ticketsToSend = [];
		var ticketAssignee = {assignee_id: $scope.user.user_id};
		ticketService.getUnAssignedTickets(ticketid).then(function(data){
			if(data.data.message==="No ticket available"){
				window.alert("All Tickets are assigned. Please try again later");
			}else{
				if(isPreviewTicketQueue)
				{
					$scope.selectedTicket = data.data;
					$scope.getAllReplies().then(function(){
						$scope.openAssignTicketModal(data.data);
					});
				}
				else
				{
					ticketService.resource.update({id: data.data.id}, ticketAssignee, function(){
						for (var x in $scope.tickets) 
						{
							if ($scope.tickets[x].id === data.data.id)
							{
								$scope.tickets[x].ticket_assigned_to = $scope.user.email;
								$scope.tickets[x].ticket_assignee_id = $scope.user.user_id;
								$scope.tickets[x].assignee_id = $scope.user.user_id;
								// $scope.changeStatus(data.data,3);
								$scope.changeStatus(data.data,ticketStatus.waiting_for_expert);
								$scope.totalTickets = $scope.totalTickets + 1;
							}
						}
					});
					$scope.tickets.push(data.data);
				}
			}
		});

		userService.resource.query({type: "expert"}, function(data){
			$scope.expertUsers = data.users;
		});
	};
});