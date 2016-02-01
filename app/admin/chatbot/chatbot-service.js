angular.module('app').factory('chatbotService',function($resource,appConfig) {

	var chatbotService = {};

	chatbotService.resource =  $resource(appConfig.apiURL+"/patterns/:id",{},{
		save:   {method:'POST'},
		update: {method: 'PUT'},
		query:  {method:'GET', isArray:false},
		delete: {method: 'DELETE'}
	});

	return chatbotService;
});