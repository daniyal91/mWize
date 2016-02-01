angular.module('app').factory('articleService',function($resource,nbAuth,$q,$http) {

	var articleService = {};

  articleService.resource = $resource(nbAuth.getHost()+'/articles/:id',{},{
    query:  {method:'GET', isArray:false},
    save: {method:'POST'},
    update: {method: 'PUT'}
  });

  articleService.submitForApproval = function(article){
    var deferred = $q.defer();
    $http.get(nbAuth.getHost()+'/articles/'+article.id+'/submit_for_approval')
    .then(function(data) {
      deferred.resolve(data);
    },
    function(data){
      deferred.reject(data);
    });
  };

  articleService.approveArticle = function(article,editor){
    var deferred = $q.defer();
    $http.get(nbAuth.getHost()+'/articles/'+article.id+'/approve?user='+editor.user_id)
    .then(function(data) {
      deferred.resolve(data);
    },
    function(data){
      deferred.reject(data);
    });
  };

  articleService.getArticleSnapshots = function(article){
    var deferred = $q.defer();
    $http.get(nbAuth.getHost()+'/article_snapshots?article='+article.id)
    .then(function(data) {
      deferred.resolve(data);
    },
    function(data){
      deferred.reject(data);
    });
    return deferred.promise;
  };

  articleService.getSnapshotDetails = function(snapshot){
    var deferred = $q.defer();
    $http.get(nbAuth.getHost()+'/article_snapshots/'+snapshot.id)
    .then(function(data) {
      deferred.resolve(data);
    },
    function(data){
      deferred.reject(data);
    });
    return deferred.promise;
  };

	return articleService;
});