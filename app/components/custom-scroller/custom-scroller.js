angular.module('app').directive('customScroller', function($compile) {
  return {
    restrict: 'A',
    scope: {    },
    link: function (scope, element, attrs) {
      element.perfectScrollbar();
      element.scrollTop(0);
      element.perfectScrollbar('update');
      element.context.style.overflow = "hidden";
      $('.ps-scrollbar-y').hover(function(){
        element.perfectScrollbar('update');
      });
      $('.ps-scrollbar-y-rail').hover(function(){
        element.perfectScrollbar('update');
      });

      // Not supported by most browsers
/*      element.bind('DOMNodeInserted', function(){
        element.perfectScrollbar('update');
      });
      element.bind('DOMNodeRemoved',function(){
        element.perfectScrollbar('update');
      });*/


      console.log(element.context.id);

      // DOMNodeInserted/DOMNodeRemoved not supported by all browsers, so using MutuationObserver
/*
      // select the target node
      var targetId = '#' + element.context.id;
      var targetNode = document.querySelector(targetId);

      // Create an observer object and assign a callback function
      var observerObject = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          element.perfectScrollbar('update');
        });
      });

      // Register the target node to observe and specify which DOM changes to watch
      observerObject.observe(targetNode, {
        attributes: true,
        attributeFilter: ["id", "dir"],
        attributeOldValue: true,
        childList: true
      });*/

      // if not works properly, so add a custom update method to height and call it, whenenver you wants to update the element

      /* // for example in user-panel-controller
       $scope.updateDeviceScrollBar = function(){
       $scope.singleDeviceHeight = 180;
       $timeout(function(){
       if($scope.totalDevices>1){
       $(".device-info-area .ps-scrollbar-y").css("height", $scope.singleDeviceHeight/$scope.totalDevices+"px");
       }
       });
       };
       */
    }
  };
});
