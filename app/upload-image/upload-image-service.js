angular.module('app').factory('uploadImageService',function($resource,nbAuth,$q,$http) {

	var uploadImageService = {};

    uploadImageService.resource = $resource(nbAuth.getHost()+'articles/upload_file',{},{
        query:  {method:'GET', isArray:false},
        save: {method:'POST'},
        update: {method: 'PUT'}
    });


    uploadImageService.uploadImage = function(imageFile){
        var image = new FormData();
        image.append("file",  imageFile);

        var deferred = $q.defer();
        $http.post(nbAuth.getHost()+'articles/upload_file', image, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(function(data) {
                deferred.resolve(data);
            },
            function(data){
                deferred.reject(data);
            });
        return deferred.promise;
    };

	return uploadImageService;
});