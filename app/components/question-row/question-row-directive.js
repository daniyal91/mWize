angular.module('app').directive('questionRow',function(){

		return {
			scope: {
				ticket: '=',
				click: '='
			},
			restrict: 'ACE',
			templateUrl: 'app/components/question-row/question-row-template.html',
			replace: true,
			link: function(scope,elem,attr){

						scope.clicked = function(){
								scope.click(scope.ticket.id);
						};
 
			}
		};
});