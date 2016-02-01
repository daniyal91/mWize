angular.module('app').controller('ArticlesCtrl',function($scope,articleService,$rootScope,mwCookies){

  $scope.showArticles = true;
  $scope.newArticleForm = false;
  $scope.showArticleDetails = false;
  $scope.user = $rootScope.user;
  $scope.articleUpdated = false;
  $scope.articleForApproval = false;
  $scope.articleApproved = false;
  $scope.articleCreated = false;
  $scope.userRole = mwCookies.get("role");

  $scope.getArticles = function(){
    articleService.resource.query({user: $scope.user.user_id},function(data){
      $scope.articles = data.articles;
    });
  };

  $scope.articleDetail = function(article) {
    articleService.getArticleSnapshots(article).then(function(data){
      $scope.articleSnapshots = data.data.snapshots;
    });
    $scope.newArticleForm = false;
    $scope.showArticleDetails = true;
    $scope.showArticles = false;
    $scope.selectedArticle = article;
  };

  $scope.toggleArticleDetail = function(){
    $scope.showArticleDetails = false;
    $scope.showArticles = true;
    $scope.newArticleForm = false;
  };

  $scope.saveArticle = function() {
    var newArticle = {title: $scope.newArticle.title, detail: $scope.newArticle.detail,
                      user_id: $scope.user.user_id};
    articleService.resource.save(newArticle,function(data){
      $scope.newArticleForm = false;
      $scope.articleCreated = true;
      $scope.showArticles = true;
      $scope.articles.push(data);
    });
  };

  $scope.updateArticle = function(article) {
    var updatedArticle = {title: article.title, detail: article.detail};
    articleService.resource.update({id: article.id},updatedArticle,function(data){
      $scope.showArticleDetails = false;
      $scope.articleUpdated = true;
      $scope.showArticles = true;
    });
  };

  $scope.submitForApproval = function(article) {
    articleService.submitForApproval(article);
    $scope.articleForApproval = true;
    $scope.showArticleDetails = false;
    $scope.showArticles = true;
    article.status = 'Waiting';
  };

  $scope.newArticle = function() {
    $scope.newArticleForm = true;
    $scope.showArticles = false;
    $scope.showArticleDetails = false;
  };

  $scope.approveArticle = function(article){
    var editor = $scope.user;
    articleService.approveArticle(article,editor);
    $scope.articleApproved = true;
    $scope.showArticleDetails = false;
    $scope.showArticles = true;
    // article.status = 'Published';
    $scope.articles.splice($scope.articles.indexOf(article), 1);
  };

  $scope.loadSnapshotDetails = function(snapshot){
    articleService.getSnapshotDetails(snapshot).then(function(data){
      $scope.selectedArticle = data.data;
    });
  };

  $scope.showArticlesByStatus = function(status){
    articleService.resource.query({user: $scope.user.user_id, status: status},function(data){
      $scope.articles = data.articles;
    });   
  };

});