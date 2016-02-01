angular.module('app').factory('categoryService',function($resource,nbAuth) {

	var categoryService = {};

  categoryService.resource = $resource(nbAuth.getHost()+'/categories/:id',{},{
    query:  {method:'GET', isArray:false},
    save: {method:'POST'},
    update: {method: 'PUT'}
  });

	return categoryService;
});