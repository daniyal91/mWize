angular.module('app').factory('ticketService',function($resource,appConfig,$q,$http) {

	var ticketService = {};

  ticketService.resource = $resource(appConfig.apiURL+'/tickets/:id',{},{
    query:  {method:'GET', isArray:false},
    save: {method:'POST'},
    update: {method: 'PUT'}
  });

  ticketService.collaborator = $resource(appConfig.apiURL+'/collaborator/:id',{},{
    query:  {method:'GET', isArray:false},
    save: {method:'POST'},
    update: {method: 'PUT'}
  });

  ticketService.getReplies = function(ticket){
    var deferred = $q.defer();
    $http.get(appConfig.apiURL+'/replies/?ticket='+ticket)
    .then(function(data) {
      deferred.resolve(data);
    },
    function(data){
      deferred.reject(data);
    });
    return deferred.promise;
  };

  ticketService.getUnAssignedTickets = function(ticket){
    var deferred = $q.defer();
    $http.get(appConfig.apiURL+'/tickets/get_ticket?previous_ticket_id='+ticket)
    .then(function(data) {
      deferred.resolve(data);
    },
    function(data){
      deferred.reject(data);
    });
    return deferred.promise;
  };

	ticketService.getQuestions = function(){
		var deferred = $q.defer();
		$http.get(appConfig.apiURL+'/tickets/get_my_questions')
			.then(function(data) {
				deferred.resolve(data);
			},
			function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};

  ticketService.saveReply = function(ticket){
    var deferred = $q.defer();
    $http.post(appConfig.apiURL+'/replies',ticket)
    .then(function(data) {
      deferred.resolve(data);
    },
    function(data){
      deferred.reject(data);
    });
    return deferred.promise;
  };

	ticketService.getQuestionStatus = function(ticketObj){
    var deferred = $q.defer();
    //console.log(appConfig.apiURL+'/tickets/get_is_read?user_id='+ticketObj.user_id+'&ticket_id='+ticketObj.ticket_id);
    $http.get(appConfig.apiURL+'/tickets/get_is_read?user_id='+ticketObj.user_id+'&ticket_id='+ticketObj.ticket_id)
    .then(function(data) {
      deferred.resolve(data);
    },
    function(data){
      deferred.reject(data);
    });
    return deferred.promise;
  };

	//this functions is being used instead of getUnAssignedTickets
	ticketService.getAvailableTickets = function(){
		var deferred = $q.defer();
		$http.get(appConfig.apiURL+'/tickets/get_available_tickets')
			.then(function(data) {
				deferred.resolve(data);
			},
			function(data){
				deferred.reject(data);
			});
		return deferred.promise;
	};

  ticketService.setStatus = function(status){
    var newStatus;
    if(status===0)
    {
      newStatus = 'Open';
    }
    else if(status===1)
    {
      newStatus = 'Closed';
    }
    else if(status===2)
    {
      newStatus = 'Deleted';
    }
    else
    {
      newStatus = 'Waiting';
    }
    return newStatus;
  };

  ticketService.setPriority = function(priority){
    var newPriority;
    if(priority===0)
    {
      newPriority = 'Low';
    }
    else if(priority===1)
    {
      newPriority = 'Medium';
    }
    else
    {
      newPriority = 'High';
    }
    return newPriority;
  };

	return ticketService;
});
