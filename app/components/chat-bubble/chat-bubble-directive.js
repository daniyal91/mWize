angular.module('app').directive('chatBubbleDirective', function($compile,phoneModelService,phoneService,$animate, $document, $window,helperFunctions, userService, nbAuth, $rootScope) {

	var variablesToReplace = [{name:'#UPSELL_SIGNUP#',
														guestValue:"While you wait, why don't you sign up? That way we'll remember you next time, and you'll have a more personalized experience. [{\"type\":\"button\",\"data\":[{\"label\":\"Yes\",\"text\":\"Yes\"},{\"label\":\"No\",\"text\":\"No\"}]}]",
														authenticatedValue:"&nbsp; [{\"type\":\"command\",\"data\":\"botDone\"}]"}];
	var phones = [];
	phoneService.resource.query(function(data){
		phones = data;
	});

	var phoneModels = [];
	phoneModelService.resource.query(function(data){
		phoneModels = data;
		//console.log(phoneModels);
		/*_.forEach(phoneModels, function(model){
			model.device = model.device.toLowerCase();
		});*/
	});

	return {
		restrict: 'A',
		scope: {
			chatBubbleDirective: "=",
			callback: "&",
			command:"&",
			isBot:"=",
			userRole:"="
		},

		link: function(scope, element, attrs, fn) {

			scope.alterMessageBasedOnRole = function(customResponseMessage){
				_.each(variablesToReplace, function(value, key){
					if(nbAuth.isAuthenticated && $rootScope.user.is_guest){
						customResponseMessage = customResponseMessage.replace(value.name, value.guestValue);
					}
					else{
						customResponseMessage = customResponseMessage.replace(value.name, value.authenticatedValue);
					}
				});
				return customResponseMessage;
			};

			scope.getParameters = function(msg){
				// Looking for #VARIABLES# in text and see if they need to be replaced first before processing.
				msg = scope.alterMessageBasedOnRole(msg);

				var response = msg.match(/\[(.*?)\]$/m);
				if (response)
				{
					var customElement = JSON.parse(response[1]);
					var customResponseMessage = response.input.replace(/\[(.*?)\]$/, "");

					//customResponseMessage = scope.alterMessageBasedOnRole(customResponseMessage);
					return {type:customElement.type,
									data:customElement.data,
									msg:customResponseMessage};
				}
				else
				{
					return {type:'msg',
									data:[],
									msg:scope.alterMessageBasedOnRole(scope.chatBubbleDirective.msg)};
				}

			};

			scope.selectListCallBack = function(){
				if(scope.phoneModelValue !== 'Other')
				{
					var message1 = 'I am using '+scope.phoneModelValue;
					scope.callback({message:message1});
				}
			};

			scope.customModelInput = function(){
				var message2 = scope.newModelValue;
				scope.callback({message:message2});
			};

			scope.phoneSelectListCallBack = function(){
				if(scope.phoneValue !== 'Other')
				{
					console.log(scope.phoneValue);
//					scope.phoneValue = JSON.parse(scope.phoneValue);
					if (scope.phoneValue.userDevice) {
						var message3a = {};
						message3a.message = 'I am talking about my ' + scope.phoneValue.name;
						message3a.event = "userDevice";
						message3a.deviceObj = scope.phoneValue;
						scope.callback({message: message3a});
					}
					else {
						var message3b = "";
						message3b = 'I am using ' + scope.phoneValue.name;
						scope.callback({message: message3b});
					}
				}
			};

			scope.osSelectListCallBack = function(){
				if(scope.osValue !== 'Other')
				{
					console.log(scope.osValue);
//					scope.phoneValue = JSON.parse(scope.phoneValue);
					if (scope.osValue) {
						var message3a = {};
						message3a.message = 'I am talking about my ' + scope.osValue.name;
						message3a.event = "userOs";
						message3a.deviceObj = scope.osValue;
						scope.callback({message: message3a});
					}
					else {
						var message3b = "";
						message3b = 'I am using ' + scope.osValue.name;
						scope.callback({message: message3b});
					}
				}
			};

			scope.showRelatedArticles = function(){
				scope.command({message:"showRelatedArticles"});
			};

			scope.customPhoneInput = function(){
				var message4 = scope.newPhoneValue;
				scope.callback({message:message4});
			};

			scope.customOsInput = function(){
				var message4 = scope.newOsValue;
				scope.callback({message:message4});
			};

			scope.setSelected = function(btn){
				$(btn.target).addClass("btn-active");
			};

			var createdAt = typeof scope.chatBubbleDirective.createdAt !== 'undefined'? scope.chatBubbleDirective.createdAt:moment().calendar();

			var response = scope.getParameters(scope.chatBubbleDirective.msg);

			scope.botMsg = "";

			if(response.type === 'button')
			{
				response.msg = '<p>'+ response.msg +'</p>';

				if(scope.isBot) {
					response.msg +=
						'<button class="btn extra-large btn-primary choose-btns custom-chat-input" ng-click=\'setSelected($event); callback({message:"' + response.data[0].text + '"})\'><span></span>' + response.data[0].label + '</button>' +
						'&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;' +
						'<button class="btn extra-large btn-primary choose-btns btn-unselected custom-chat-input" ng-click=\'setSelected($event); callback({message:"' + response.data[1].text + '"})\'> <span></span>' + response.data[1].label + '</button>';
				}
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
					response.msg +=
					'<button disabled class="btn extra-large btn-primary choose-btns btn-active custom-chat-input" ng-click="command({message:\'requestFeedback\'})">Yes, Question Answered</button>' +
					'&nbsp; &nbsp;&nbsp;&nbsp;' +
					'<button disabled class="btn extra-large btn-primary choose-btns btn-unselected custom-chat-input" ng-click=""> No</button>';
				}
			}
			else if(response.type === 'showStars')
			{
				response.msg = '<p>'+ response.msg +'</p>';
				if(scope.userRole.name!=='expert')
				{
					scope.command({message:"showStars"});
					//response.msg += '<div  star-rating rating-value="5" max="5" on-rating-selected=""></div>';
				}
			}
			else if(response.type === 'dropdown')
			{
				if(response.data.dataType === 'device')
				{
					scope.phones = phones;
					response.msg = "<p>" + response.msg + "</p>";
					if(nbAuth.isAuthenticated && !$rootScope.user.is_guest){
						userService.getUserDevices().then(function (devices) {
							if (devices.data.length) {
								scope.phones = [];
								_.each(devices.data, function (device) {
									device.userDevice = true;
									scope.phones.push(device);
								});
								response.msg = "<p>Please select phone from your devices</p>";
							}
						});
					}

					if(scope.isBot) {
						response.msg +=
							"<div class='custom-select-css2'>"+
							"<select class='form-control custom-chat-input' ng-options='phone as phone.name for phone in phones' ng-model='phoneValue' ng-change='phoneSelectListCallBack()'>" +
							"<option value=''>Choose brand</option>" +
							"</select>" +
							"</div>"+
							"<!--<option ng-repeat='phone in phones' value='{{phone}}'>{{phone.name}}</option>" +
							"<option>Other</option>" +
							"<br>" +
							"<div ng-show='phoneValue===\"Other\"'>" +
							"<input type='text' class='form-control custom-chat-input' ng-model='newPhoneValue' />" +
							"<br>" +
							"<button class='btn btn-lg mw-snd-btn btn-default custom-chat-input' ng-click='customPhoneInput()'>Submit</button>" +
							"</div>-->";
					}
				}
				else if(response.data.dataType === 'os')
				{
					//scope.os = os;
					response.msg = "<p>" + response.msg + "</p>";
					var idd = -1;

					phoneModels.forEach(function(p){
							if(p.name === response.data.filter)
							{
								idd = p.device_id;
								return;
							}
					});

						userService.getAllOs().then(function (o) {
							if (o.data.length) {
								scope.os = [];
								_.each(o.data, function (o) {
									//os.userDevice = true;
									if(o.id === idd)
									{
										scope.os.push(o);
									}
								});
								response.msg = "<p>Please select OS of your devices</p>";
							}
						});

					if(scope.isBot) {
						response.msg +=
							"<div class='custom-select-css2'>"+
							"<select class='form-control custom-chat-input' ng-options='o as o.name for o in os' ng-model='osValue' ng-change='osSelectListCallBack()'>" +
							"<option value=''>Choose OS</option>" +
							"</select>" +
							"</div>"+
							"<!--<option ng-repeat='phone in os' value='{{o}}'>{{o.name}}</option>" +
							"<option>Other</option>" +
							"<br>" +
							"<div ng-show='osValue===\"Other\"'>" +
							"<input type='text' class='form-control custom-chat-input' ng-model='newOsValue' />" +
							"<br>" +
							"<button class='btn btn-lg mw-snd-btn btn-default custom-chat-input' ng-click='customOsInput()'>Submit</button>" +
							"</div>-->";
					}
				}
				else
				{
					if(response.data.filter === '')
					{
						scope.phoneModels = phoneModels;
					}
					else
					{

						var items = [];
						var id = -1;

						phones.forEach(function(i){
									if(i.name.toLowerCase() === response.data.filter.toLowerCase().trim())
									{
										id = i.id;
									}
						});	

						phoneModels.forEach(function(i){
								if(i.device_id === id)
								{
									items.push(i);
								}
						});

						scope.phoneModels = items;

						//_.where(phoneModels, { 'device': response.data.filter.toLowerCase().trim() });
							 
					}
					response.msg = "<p>"+response.msg+"</p>"; //"<p> What "+response.data.filter+" model are you using? </p>"+

					if(scope.isBot) {
						response.msg +=
							"<div class='custom-select-css2'>"+
							"<select class='form-control custom-chat-input' ng-model='phoneModelValue' ng-change='selectListCallBack()'>" + // ng-change='callback({message:\"I am using \"+phoneModelValue})'
							"<option value=''>Choose a model</option>" +
							"<option ng-repeat='model in phoneModels'>{{model.name}}</option>" +
							"<!--<option>Other</option>" +
							"</select>" +
							"</div>"+
							"<br>" +
							"<div ng-show='phoneModelValue===\"Other\"'>" +
							"<input type='text' class='form-control custom-chat-input' ng-model='newModelValue' />" +
							"<br>" +
							"<button class='btn btn-lg mw-snd-btn btn-default custom-chat-input' ng-click='customModelInput()'>Submit</button>" +
							"</div>-->";
					}
				}

			}
			else if(response.type === 'textbox')
			{
				response.msg = "<label>"+response.data.label+"</label>";
				if(scope.isBot) {
					response.msg +=
						"<input type='text' class='form-control custom-chat-input' ng-model='inputFieldValue' placeholder=" + response.data.placeholder + " />" +
						"<br>" +
						"<button class='btn btn-lg mw-snd-btn btn-default' ng-click='callback({message:inputFieldValue})'>Submit</button>";
				}
			}
			else if(response.type === 'command')
			{
				scope.command({message:response.data});
			}

			scope.response = response;

			if(scope.response.type === 'feedback')
			{
				scope.output = response.msg;
			}
			else
			{
				if(!scope.chatBubbleDirective.isBot)
				{
					scope.output = '<p ng-bind-html="response.msg"></p>';
				}
				else
				{
					// Message from Bot
					scope.output = response.msg;
				}
		}

			if(scope.chatBubbleDirective.direction === 'left')
			{
				var avatar;
				if(scope.chatBubbleDirective.isBot)
				{
					avatar = '/assets/images/avatar-1.png';
				}
				else
				{
					avatar = '/assets/images/avatar02.png';
				}
				var e5 = angular.element('<li class="left clearfix">'+
																		'<div class="col-sm-2">'+
																			'<span class="chat-img">'+
																				'<img src="'+avatar+'" alt="User Avatar" class="mCS_img_loaded" />'+
																			'</span>'+
																		'</div>'+
																		'<div class="chat-body col-sm-7">'+
																			'<small class="txt-orange">'+createdAt+'</small>'+
																			'<p>'+
																			scope.output+
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
				var validRoles = ['customer','guest'];
				var userRole = (typeof scope.userRole !== 'undefined' && $.inArray(scope.userRole.name, validRoles) !== -1)?scope.userRole.name:'';

					e6 = angular.element('<li class="right clearfix">'+
																'<div class="col-sm-2 pull-right">'+
																	'<span class="chat-img round-img cursor-pointer" avatar-directive user-role="'+userRole+'">'+
																	'</span>'+
																'</div>'+
																'<div class="chat-body col-sm-7 pull-right">'+
																	'<small class="txt-orange">'+createdAt+'</small>'+
																	'<p>'+
																		'{{chatBubbleDirective.msg}}'+
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
