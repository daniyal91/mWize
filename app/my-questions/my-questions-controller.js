angular.module('app').controller('MyQuestionsCtrl', function ($scope,$rootScope, ticketService, $state, timezoneService, nbAuth, $q) {

	$scope.isValidForm = false;

	$scope.login = function () {
		var deferred = $q.defer();
		var credentials = {email: $scope.user.email, password: $scope.user.password};
		if(!nbAuth.isAuthenticated)
		{
			console.log("login: myquestionsCtrl");
		
			nbAuth.login(credentials)
				.then(function (res) {
					if(res.status===200) {
						deferred.resolve(res);
					}
					else if (res.status === 401) {
						console.log("User not authorized");
						deferred.reject(res);
					}
				},
				function (res) {
					console.log("user has some issues logging into the account");
					deferred.reject(res);
				});
		}else
		{
			deferred.resolve("ok");
		}
		return deferred.promise;
	};

	$scope.init = function () {
		$scope.login().then(function () {
			var autoTimeZoneDetection = timezoneService.jstz.determine();
			ticketService.getQuestions({user_id: $rootScope.user.id}).then(function (data) {
				$scope.tickets = data.data;
				_.each($scope.tickets.recent_tickets, function (recent_tickets) {
					ticketService.getQuestionStatus({user_id: $rootScope.user.user_id, ticket_id: recent_tickets.id}).then(function(read_tickets){
						var timeZone = moment.tz(recent_tickets.created_at, autoTimeZoneDetection.name());
						recent_tickets.created_at = moment(timeZone._d).fromNow();
						recent_tickets.is_read = read_tickets.data.is_read;
						recent_tickets.status = recent_tickets.status.replace(/_/g, " ");
					});
				});

				_.each($scope.tickets.previous_tickets, function (previous_tickets) {
					ticketService.getQuestionStatus({user_id: $rootScope.user.user_id, ticket_id: previous_tickets.id}).then(function(read_tickets){
						var timeZone = moment.tz(previous_tickets.created_at, autoTimeZoneDetection.name());
						previous_tickets.created_at = moment(timeZone._d).fromNow();
						previous_tickets.is_read = read_tickets.data.is_read;
						previous_tickets.status = previous_tickets.status.replace(/_/g, " ");
					});
				});

			});
		});
	};

	$scope.init();

	$scope.loadConversation = function (ticket_id) {
		$state.go('public.askASpecialist', {id: ticket_id});
	};

});