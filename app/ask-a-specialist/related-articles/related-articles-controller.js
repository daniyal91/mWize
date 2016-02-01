angular.module('app').controller('RelatedArticlesCtrl',function($rootScope,$scope,relatedArticlesService){

	$scope.showArticleList = true;
	$scope.articles = [];
	relatedArticlesService.resource.query({},function(response){
		$scope.articles = response.articles;
	});

	$scope.iseffect = false;

	$scope.viewDetails = function(article){
//		$scope.showArticleList=false;
//		$scope.currentArticle = article;
	};

	$scope.viewList = function(){
		$scope.showArticleList=true;
	};

	$rootScope.clearTimer = function(){
		clearInterval($scope.interval); 
		$scope.iseffect = false;
	};

	$scope.$on('NEW_MESSAGE_ON_RELATED_ARTICLES',function(d){
		 // trigger bounce
		 if(!$scope.iseffect)
		 {
		 		$scope.iseffect = true;
		 		$scope.interval = setInterval(function(){ $('.pointer').first().effect("bounce"); }, 1200);
		 		setTimeout(function() {$scope.clearTimer();}, 10000);
		 }
	}); 
});