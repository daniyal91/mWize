angular.module('app').directive('chatBubbleOutput', function($compile,chatBubbleOutputService,$animate, $document, $window,helperFunctions, userService, nbAuth, $rootScope) {

	return {
		restrict: 'A',
		scope: {
			chatBubbleOutput: "=",
			callback: "&",
			command:"&",
			params:"=",
			isBot:"=",
			userRole:"="
		},

		link: function(scope, element, attrs, fn) {

			var validRoles = ['customer','guest','expert'];
			var userRole = (typeof scope.userRole !== 'undefined' && $.inArray(scope.userRole.name, validRoles) !== -1)?scope.userRole.name:'';

			scope.ratingEnabled=true;
			scope.showRelatedArticles = function(){
				scope.command({message:"showRelatedArticles"});
			};

			scope.ratingSelected = function(r){
				console.log(r);
				scope.ratingEnabled=false;
			};

			scope.controlCallbacks = chatBubbleOutputService.controlCallbacks;
			var response = chatBubbleOutputService.extractControls(scope.chatBubbleOutput.content);
				
			if(response.type === 'button')
			{
				response.msg = '<p>'+ response.msg +'</p>';

				if(scope.params.showControls) {
					response.msg += chatBubbleOutputService.buttonControl(response.data);
				}
			}

			if(response.type === 'dropdown')
			{
				response.msg = "<p>" + response.msg + "</p>";
				
				if(scope.params.showControls) {
					scope.ListFiltered = chatBubbleOutputService.filterByDevice(scope,response.data.dataType,response.data.filter);
					response.msg += chatBubbleOutputService.dropDownControl(response.data.dataType,"ListFiltered","selectValue");
				}
			}
			

			//response.msg = chatBubbleOutputService.processResponse(scope,response);			
			if(response.type === 'textbox')
			{
				response.msg = "<label>"+response.data.label+"</label>";
				if(scope.params.showControls) {
					response.msg +=
						"<input type='text' class='form-control custom-chat-input' ng-model='inputFieldValue' placeholder=" + response.data.placeholder + " />" +
						"<br>" +
						"<button class='btn btn-lg mw-snd-btn btn-default' ng-click='callback({message:inputFieldValue})'>Submit</button>";
				}
			}
			
			if(response.type === 'command')
			{
				scope.command({message:response.data});
			}

			if(response.type === 'feedback')
			{
				response.msg = '<p>'+ response.msg +'</p>';

				if(scope.userRole.name!=='expert')
				{
				response.msg +=
					'<button class="btn extra-large btn-primary choose-btns btn-active custom-chat-input" ng-click="command({message:\'requestFeedback\'})">Yes, Question Answered</button>' +
					'&nbsp; &nbsp;&nbsp;&nbsp;' +
					'<button class="btn extra-large btn-primary choose-btns btn-unselected custom-chat-input" ng-click=""> No</button>';
				}
				else
				{
					//Don't Display request for feedback buttons to expert
					/*response.msg +=
					'<button disabled class="btn extra-large btn-primary choose-btns btn-active custom-chat-input" ng-click="command({message:\'requestFeedback\'})">Yes, Question Answered</button>' +
					'&nbsp; &nbsp;&nbsp;&nbsp;' +
					'<button disabled class="btn extra-large btn-primary choose-btns btn-unselected custom-chat-input" ng-click=""> No</button>';*/
				}
			}
			
			if(response.type === 'showStars')
			{
				response.msg = '<p>'+ response.msg +'</p>';
				//if(scope.userRole.name!=='expert')
				//{
					//scope.command({message:"showStars"});
				console.log("showStars ",userRole);
				if(userRole!=='expert') {
						response.msg += '<div star-rating ng-show="params.showStars" rating-value="0" max="5" is-active="ratingEnabled" on-rating-selected="ratingSelected(rating)"></div>';
					}
				//}
			}
			


			// ChatBubble Direction
			var createdAt = typeof scope.chatBubbleOutput.createdAt !== 'undefined'? scope.chatBubbleOutput.createdAt:moment().calendar();

			if(scope.chatBubbleOutput.direction === 'left')
			{
				var avatar;
				if(scope.chatBubbleOutput.is_bot)
				{
					avatar = '/assets/images/avatar-1.png';
				}
				else
				{
					avatar = '/assets/images/avatar02.png';
				}
				var e5 = angular.element('<li class="left clearfix">'+
																		'<div class="col-sm-1">'+
																			'<span class="chat-img">'+
																				'<img src="'+avatar+'" alt="User Avatar" class="mCS_img_loaded" />'+
																			'</span>'+
																		'</div>'+
																		'<div class="chat-body col-sm-7">'+
																			'<small class="txt-orange">'+createdAt+'</small>'+
																			'<p>'+
																			response.msg+
																			'</p>'+
																			// '<small class="light-grey"><em>If you already have an account you may <a href="#"><strong>login</strong></a> now for a more personalized experience.</em></small>'+
																			'<span class="left-pointer"></span>'+
																		'</div>'+
																	'</li>');
				var e5Compiled = $compile(e5)(scope);
				e5Compiled.insertAfter(element);
			}
			else // right
			{
				var e6 ='';

					e6 = angular.element('<li class="right clearfix">'+
																'<div class="col-sm-1 pull-right">'+
																	'<span class="chat-img round-img cursor-pointer" avatar-directive user-role="'+userRole+'">'+
																	'</span>'+
																'</div>'+
																'<div class="chat-body col-sm-7 pull-right">'+
																	'<small class="txt-orange">'+createdAt+'</small>'+
																	'<p>'+
																		response.msg+
																	'</p>'+
																	'<span class="right-pointer">'+
																	'</span>'+
																'</div>'+
															'</li>');

				var e6Compiled = $compile(e6)(scope);
				e6Compiled.insertAfter(element);
			}
		}
	};
});
