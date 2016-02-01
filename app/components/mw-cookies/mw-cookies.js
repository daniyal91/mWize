angular.module('app').factory('mwCookies',function($cookieStore,localStorageService) {

	var mwCookies = {};
	mwCookies.type = "localStorage";

	mwCookies.set = function(key,value){
		if(this.type==="localStorage")
		{
			localStorageService.set(key,value);
		}
		else{
			$cookieStore.put(key,value);
		}
	};

	mwCookies.get = function(key){
		if(this.type==="localStorage")
		{
//			console.log("key:"+key);
//			console.log(localStorageService.get(key));
			if(typeof(localStorageService.get(key))==='undefined' || localStorageService.get(key)===null)
			{	
				return false;
			}else{
				return localStorageService.get(key);
			}
		}
		else
		{
			return $cookieStore.get(key);
		}
	};

	mwCookies.remove = function(key){
		if(this.type==="localStorage")
		{
			localStorageService.remove(key);
		}
		else
		{
			$cookieStore.remove(key);
		}
	};

	mwCookies.removeAll = function(){
		if(this.type==="localStorage")
		{
			localStorageService.clearAll();
		}
		
	};

	return mwCookies;
});