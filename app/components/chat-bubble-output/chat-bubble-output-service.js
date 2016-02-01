angular.module('app').service('chatBubbleOutputService',function($rootScope) {

	this.extractControls = function(msg){
		var response = msg.match(/\[(.*?)\]$/m);
		if (response)
		{
			var customElement = JSON.parse(response[1]);
			var customResponseMessage = response.input.replace(/\[(.*?)\]$/, "");

			return {type:customElement.type,
							data:customElement.data,
							msg:customResponseMessage};
		}
		else
		{
			return {type:'msg',
							data:[],
							msg:msg};
		}
	};

	this.buttonControl = function(data){
		return	'<button ng-disabled="params.disableControls" class="btn extra-large btn-primary choose-btns custom-chat-input" ng-click=\'controlCallbacks("btn",$event,this,"'+data[0].text+'");\'><span></span>' + data[0].label + '</button>' +
			'&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;' +
			'<button ng-disabled="params.disableControls" class="btn extra-large btn-primary choose-btns btn-unselected custom-chat-input" ng-click=\'controlCallbacks("btn",$event,this,"' + data[1].text + '");\'> <span></span>' + data[1].label + '</button>';

	};

	this.dropDownControl = function(type,dataSource,ngModel){
		//firstOption = typeof firstOption === 'undefined'?'Choose':firstOption;
		//phoneSelectListCallBack
		var typeToInitialMessage = {"device":"Device",
																"model":"Device Model",
																"os":"Operating System",
																"osversion":"OS Version",
																"operator":"Network Carrier",
																"userDeviceProfile":"Your Device Profile"};

		if(typeToInitialMessage[type] === 'Your Device Profile'){
			return "<div class='custom-select-css2'>"+
				"<select class='form-control custom-chat-input' ng-options='phone as phone.device_title for phone in "+dataSource+"' ng-disabled='params.disableControls' ng-model='"+ngModel+"' ng-change='controlCallbacks(\""+type+"\",$event,this)'>" +
				"<option value=''>Choose "+typeToInitialMessage[type]+"</option>" +
				"</select>" +
				"</div>";
		}
		else{
			return "<div class='custom-select-css2'>"+
				"<select class='form-control custom-chat-input' ng-options='phone as phone.name for phone in "+dataSource+"' ng-disabled='params.disableControls' ng-model='"+ngModel+"' ng-change='controlCallbacks(\""+type+"\",$event,this)'>" +
				"<option value=''>Choose "+typeToInitialMessage[type]+"</option>" +
				"</select>" +
				"</div>";
		}
	};

	this.filterByDevice = function(scope,type,filter){

		if(typeof scope.params.deviceList === 'undefined')
		{
			return [];
		}

		if(filter==='')
		{
			return scope.params[type+"List"];
		}
		else
		{
			var devices = [];
			var os = [];
			var models = [];
			var deviceId = 0;
			var items = [];
			if(type==='model')
			{
				devices = scope.params.deviceList;
				models = scope.params.modelList;
				deviceId = -1;
				items = [];
				devices.forEach(function(i){
					if(i.name.toLowerCase() === filter.toLowerCase().trim())
					{
						deviceId = i.id;
					}
				});	

				models.forEach(function(i){
					if(i.device_id === deviceId)
					{
						items.push(i);
					}
				});

				return items;
			}
			else if (type==='os')
			{
				devices = scope.params.deviceList;
				os = scope.params.osList;
				deviceId = -1;
				items = [];
				devices.forEach(function(i){
					if(i.name.toLowerCase() === filter.toLowerCase().trim())
					{
						deviceId = i.id;
					}
				});	

				os.forEach(function(i){
					if(i.device_id === deviceId)
					{
						items.push(i);
					}
				});
				return items;

			}
			else if (type==='osversion')
			{
				os = scope.params.osList;
				var osVersion = scope.params.osVersionList;
				var osId = -1;
				items = [];
				os.forEach(function(i){
					if(i.name.toLowerCase() === filter.toLowerCase().trim())
					{
						osId = i.id;
					}
				});

				osVersion.forEach(function(i){
					if(i.operating_system_id === osId)
					{
						items.push(i);
					}
				});
				return items;

			}
		}
	};

	this.controlCallbacks = function(type,event,scope,data){
		if(type==='btn')
		{
			$(event.target).addClass("btn-active").attr("disabled","disabled");
			$(event.target).next().attr("disabled","disabled");
			$(event.target).prev().attr("disabled","disabled");
			scope.callback({message: data});
		}
		else if (type==='device' || type==='model' || type==='os' || type === 'osversion' || type === 'operator' || type === 'userDeviceProfile')
		{
			console.log(type+" callback called: "+scope.selectValue.name);
			var message3a = {};
			message3a.message = scope.selectValue.name;
			message3a.type = type;
			message3a.selectObj = scope.selectValue;
			scope.callback({message: message3a});
		}
		else if (type==='rating')
		{
			
		}
	};

});