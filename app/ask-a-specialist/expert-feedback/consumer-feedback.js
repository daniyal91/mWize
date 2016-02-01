angular.module('app').factory('consumerFeedbackService',function($resource,appConfig) {

	var consumerFeedback = {};

	consumerFeedback.resource = $resource(appConfig.apiURL+'/consumer_feedbacks/:id',{},{
    query:  {method:'GET', isArray:false},
    save: {method:'POST'},
    update: {method: 'PUT'}
  });
  
	return consumerFeedback;
});