angular.module('app').directive('btnProcess', function($parse,$timeout) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs, fn) {
			//element.addClass("btn"); //btn-block 

			element.on('click',function(event){
				element.attr('disabled','disabled');
				var currentHTML = element.html();
				element.prepend('<span class="fa fa-cog fa-spin"></span>&nbsp;');

				//console.log(attrs.btnProcess);

				if(scope.isValidForm === true){
					var fna = $parse(attrs.btnProcess);
					fna(scope).then(function(res){
						element.removeAttr('disabled');
						element.html(currentHTML);
					},function(res){
						element.removeAttr('disabled');
						element.html(currentHTML);
					});
				}
				else{
					element.removeAttr('disabled');
					element.html(currentHTML);
				}
			});

		}
	};
});