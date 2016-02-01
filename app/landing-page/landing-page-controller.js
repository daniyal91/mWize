angular.module('app').controller('LandingPageCtrl',function($scope,nbAuth,ticketService,$state,$q, $rootScope,$stateParams,$window){

	$scope.ask = {question:""};

	/*if(nbAuth.isAuthenticated())
	{
		$rootScope.$broadcast('event:auth:successful');
	}*/

	$scope.submitQuestion = function(){

		var newTicket = {};
		var deferred = $q.defer();

			if (nbAuth.isAuthenticated()) {
				newTicket = {subject: $scope.ask.question, email: $rootScope.user.email};
			}
			else {
				newTicket = {subject: $scope.ask.question};
			}

			console.log("New ticket object being created");
			console.log(newTicket);

			ticketService.resource.save(newTicket, function (data) {
				$scope.user = data.user;
				if (!nbAuth.isAuthenticated()) {
					$scope.login(data.ticket);
				}
				else {
					$state.transitionTo('public.askASpecialist', {id: data.ticket.id});
				}

				deferred.resolve(data);
			});
		return deferred.promise;
	};

	$scope.login = function(ticket){
		console.log("login: landin-page-controller");
		var deferred = $q.defer();
		var credentials = {email:$scope.user.email, password: $scope.user.password};
		nbAuth.login(credentials)
			.then(function(res){
				console.log(res);
				if(res.status===200)
				{
					deferred.resolve(res);
					$state.go('public.askASpecialist',{id: ticket.id});
				}
				else if(res.status===401)
				{
					console.log("User not authorized");
					deferred.reject(res);
				}
			},
			function(res){
				console.log("user has some issues logging into the account");
				deferred.reject(res);
			});
		return deferred.promise;
	};

	$scope.validateEmail = function (e) { 
	    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(e);
	};

	if($stateParams.email && $scope.validateEmail($window.atob($stateParams.email))){
			$rootScope.$broadcast('LOGIN_OPEN_WITH_EMAIL',$window.atob($stateParams.email));
	}

});

