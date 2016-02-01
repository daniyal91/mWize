angular.module('app').controller('ExpertFeedbackCtrl',function($scope,$modalInstance,resolvedData,consumerFeedbackService){

	$scope.expertRating = 0;
	$scope.mwizeRating = 0;
	$scope.rateFunction = function(rating) {
		//alert("Rating selected - " + rating);
		console.log(rating);
	};

	$scope.data = resolvedData;

	$scope.saveFeedback = function(){
		consumerFeedbackService.resource.save({
			ticket_id:$scope.data.ticket_id,
			by_user_id:$scope.data.by_user_id,
			for_user_id:$scope.data.for_user_id,
			message:this.feedback,
			expert_rating:this.expertRating,
			mwize_rating:this.mwizeRating
		},function(response){
			console.log(response);
			$scope.ok();
		});
	};

	$scope.ok = function () {
		$modalInstance.close({in:$scope.data,out:this});
	};

	$scope.cancel = function () {
		$modalInstance.dismiss('cancel');
	};

	$scope.close = function () {
		$modalInstance.close();
	};

});