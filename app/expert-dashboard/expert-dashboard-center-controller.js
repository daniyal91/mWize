angular.module('app').controller('ExpertDashboardCenterCtrl',function($rootScope,$scope,nbAuth,helperFunctions,$timeout,timezoneService){

	var autoTimeZoneDetection = timezoneService.jstz.determine();

	$scope.chatParams = {showControls:false,
		disableControls:false,showStars:false};

	$scope.setTitle = function(title){
				$scope.$parent.ticket.subject = title;
	};

  $scope.logout = function(){
      nbAuth.logout();
  };

	$rootScope.$on('LOAD_TICKET_CHAT',function(event,data){
		// load chat
		//$scope.setTitle(data.ticket.title);
		$scope.loadChat(data.ticketId);
	});

	$scope.loadChat = function(ticketId){
		//$scope.$parent.chat.messages = [];
		$scope.setCurrentTicketId(ticketId);
		console.log("loadChat");

		_.each($scope.$parent.tickets[$scope.getCurrentTicketId()].comments,function(comment,i){
			var timeZone = moment.tz(comment.created_at, autoTimeZoneDetection.name());
			comment.createdAt = timeZone._d;
			$scope.$parent.tickets[$scope.getCurrentTicketId()].comments[i].createdAt = moment(comment.createdAt).calendar();
			if (comment.is_bot) {
				$scope.$parent.tickets[$scope.getCurrentTicketId()].comments[i].direction = "left";
			}
			else
			{
				if (comment.user_id === $rootScope.user.user_id) {
					$scope.$parent.tickets[$scope.getCurrentTicketId()].comments[i].direction = "left";
				}
				else
				{
					$scope.$parent.tickets[$scope.getCurrentTicketId()].comments[i].direction = "right";
				}
			}
		});
		helperFunctions.scrollToBottom(50);

	};




});
