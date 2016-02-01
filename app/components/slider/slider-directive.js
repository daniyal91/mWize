angular.module('app')
.directive('slider', function ($window) {
		return {
				restrict:'A',
				scope:{
					slider:'='
				},
				link: function (scope, element, attrs) {
						var windowHeight = $(window).height();
						var windowWidth = $(window).width();
						var sliderBottom = windowHeight; // - 28;
						
						element.addClass("slider");
						element.css({'height': windowHeight+'px',
													'width': windowWidth+'px',
												'bottom':'-'+sliderBottom+'px'});

						$(window).resize(function(){
							if(!scope.slider)
							{
								element.css({bottom: '-'+window.innerHeight+'px'});
							}
						});

						scope.$watch('slider',
							function(newValue, oldValue) {
								
								var windowHeight = $(window).height();
								var windowWidth = $(window).width();
								var sliderBottom = windowHeight; // - 28;
								
								/*element.css({'height': windowHeight+'px',
													'width': windowWidth+'px',
												'bottom':'-'+sliderBottom+'px'});*/

								if(newValue)
								{
									element.animate({bottom: '0px'}, 1000);
								}
								else
								{
									element.animate({bottom: '-'+sliderBottom+'px'}, 1000);
								}
							}
						 );
				}
		};
});