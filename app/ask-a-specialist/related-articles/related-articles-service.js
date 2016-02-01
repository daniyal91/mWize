angular.module('app').factory('relatedArticlesService',function($q,$resource,appConfig) {

	var relatedArticlesService = {};
	
	relatedArticlesService.resource = $resource(appConfig.apiURL+'/articles/:id',{},{
    query:  {method:'GET', isArray:false},
    save: {method:'POST'},
    update: {method: 'PUT'}
  });

	return relatedArticlesService;
});