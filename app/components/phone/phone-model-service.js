angular.module('app').factory('phoneModelService',function($resource,appConfig) {

	var phoneModelService = {};

  phoneModelService.resource = $resource(appConfig.apiURL+'/phone_models/:id',{},{
    query:  {method:'GET', isArray:true},
    save: {method:'POST'},
    update: {method: 'PUT'}
  });

	return phoneModelService;
});