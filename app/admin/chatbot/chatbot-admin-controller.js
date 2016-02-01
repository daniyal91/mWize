angular.module('app').controller('ChatbotAdminCtrl',function($scope,$http,chatbotService,mwizeModalService){
	

	// $scope.treeOptions = {
	//   nodeChildren: "children",
	//   dirSelectable: true,
	//   injectClasses: {
	//       ul: "a1",
	//       li: "a2",
	//       liSelected: "a7",
	//       iExpanded: "a3",
	//       iCollapsed: "a4",
	//       iLeaf: "a5",
	//       label: "a6",
	//       labelSelected: "a8"
	//   }
	// };

	$scope.showSelected = function(node) {
		if(typeof node !== 'undefined')
		{
			chatbotService.resource.query({type:node.id},function(data){
				$scope.newPatterns = data.patterns.patterns;
				var indexOfParent = _.indexOf(_.pluck($scope.dataForTheTree, 'id'), node.id);
				_.forEach($scope.newPatterns,function(pattern){ 
					$scope.dataForTheTree[indexOfParent].children.push(pattern);
					$scope.dataForTheTree[indexOfParent].children = _.uniq($scope.dataForTheTree[indexOfParent].children, 'id');
				});
			});
		}
	};

	$scope.getPatterns = function(parent){
		chatbotService.resource.query({type:parent},function(data){
			// $scope.patterns = data.patterns.patterns;
			// $scope.dataForTheTree = $scope.patterns;
			$scope.list = data.patterns.patterns;
		});
	};

	$scope.toggle = function(scope) {
		scope.toggle();
	};
		
	$scope.showNodeDetails = function(node) {
		
 /*   if(node.items.length > 0)
		{
			node.items = [];
		}
		else
		{*/
				chatbotService.resource.query({type:node.id},function(data){
				$scope.newPatterns = data.patterns.patterns;
				_.forEach($scope.newPatterns,function(pattern){ 
					console.log(pattern);
					node.items.push({
						id: pattern.id,
						priority: pattern.priority,
						skipif: pattern.skipif,
						pattern: pattern.pattern,
						template: pattern.template,
						ifid: pattern.ifid,
						srai: pattern.srai,
						items: []
					});
					node.items = _.uniq(node.items, 'id');
				});

			});

		//}

	};

	$scope.newPattern = function(type) {
		var ifid;
		if(type === 'parent')
		{
			ifid = 0;
		}
		else // child node
		{
			ifid = type.id;
		}
		mwizeModalService.open('app/admin/chatbot/_new-pattern-modal.html', {type: type}).then(function(data){
			var obj = {pattern: data.out.data.node.pattern,
								 // ifid:data.out.ifid,
								 ifid: ifid,
								 priority: data.out.data.node.priority,
								 skipif: data.out.data.node.skipif,
								 srai: data.out.data.node.srai,
								 template: data.out.data.node.template};
			chatbotService.resource.save(obj,function(response){
				if(type === 'parent')
				{
					$scope.list.push(response.pattern);  
				}
				else // child node
				{
					type.items.push({
						id: response.pattern.id,
						priority: response.pattern.priority,
						skipif: response.pattern.skipif,
						pattern: response.pattern.pattern,
						template: response.pattern.template,
						ifid: response.pattern.ifid,
						items: []
					});
					type.items = _.uniq(type.items, 'id');
				}
			});
		});
	};

	$scope.removePattern = function(node,scope) {
		chatbotService.resource.delete({id:node.id},function(response){
			scope.remove();
		});
	};

	$scope.editPattern = function(node){
		var ifid = node.ifid;
		mwizeModalService.open('app/admin/chatbot/_update-pattern-modal.html', {node: node}).then(function(data){
			var obj = {pattern: data.out.data.node.pattern,
								 ifid:ifid,
								 priority: data.out.data.node.priority,
								 skipif: data.out.data.node.skipif,
								 srai: data.out.data.node.srai,
								 template: data.out.data.node.template};
			chatbotService.resource.update({id:node.id},obj,function(response){
				console.log("after update");
				console.log(response);
				//if(ifid === 0)
				//{
				//	$scope.list.push(response.pattern);  
				//}
				//else // child node
				//{
					// node.items.push({
					//   id: response.pattern.id,
					//   pattern: response.pattern.pattern,
					//   template: response.pattern.template,
					//   ifid: response.pattern.ifid,
					//   items: []
					// });
					// node.items = _.uniq(node.items, 'id');
				//}
			});
		});

	};

	$scope.duplicatePattern = function(node,scope){
		var ifid = node.ifid;
		mwizeModalService.open('app/admin/chatbot/_new-pattern-modal.html', {node: node}).then(function(data){
			var obj = {pattern: data.out.data.node.pattern,
								 // ifid:data.out.ifid,
								 ifid: ifid,
								 priority: data.out.data.node.priority,
								 skipif: data.out.data.node.skipif,
								 srai: data.out.data.node.srai,
								 template: data.out.data.node.template};
			chatbotService.resource.save(obj,function(response){
				if(ifid === 0)
				{
					$scope.list.push(response.pattern);  
				}
				else // child node
				{
					// node.items.push({
					//   id: response.pattern.id,
					//   pattern: response.pattern.pattern,
					//   template: response.pattern.template,
					//   ifid: response.pattern.ifid,
					//   items: []
					// });
					// node.items = _.uniq(node.items, 'id');
				}
			});
		});
	};

});