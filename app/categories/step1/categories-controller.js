angular.module('app').controller('CategoriesCtrl',function($scope,$http,$state,nbAuth,categoryService){

  $scope.showCategoryDetails = false;
  $scope.showSubcatDetails = false;

  $scope.getCategories = function(){
    categoryService.resource.query(function(data){
      var parentCategories =_.filter(data.categories, { parent_id: 0 });
      $scope.parentCategories = parentCategories;
      $scope.categories = data.categories;
    });
  };

  $scope.showDetails = function(category){
    $scope.showCategoryDetails = true;
    $scope.subCategories = _.filter($scope.categories, { parent_id: category });
  };

  $scope.showSubcategoryDetails = function(subcategory){
    $scope.showSubcatDetails = true;
    $scope.selectedSubcategory = subcategory;
  };

  $scope.askExpert = function(subcategory){
    $state.go('public.categories-step2',{category: subcategory.id});
  };

});