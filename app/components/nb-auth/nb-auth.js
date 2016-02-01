angular.module('nb.auth', ['ui.router','ngCookies','LocalStorageModule'])

.provider('nbAuth',function(){

	this.config = {
		host: '',
		token: '',
		isAuthenticated: false
	};

	this.setHost = function(host){
		this.config.host = host;
	};

	this.setToken = function(token){
		this.config.token = token;
	};

	this.getToken = function(token){
		return this.config.token;
	};

	var that=this;

	// Define the provider's instance
	this.$get = ['$rootScope','$http','$q','mwCookies',
	function ($rootScope,$http,$q,mwCookies) {
		var factory = {};

		$rootScope.user = {};
		$rootScope.user.user_id = false;
		$rootScope.user.is_guest = true;
		$rootScope.user.first_name = "";
		$rootScope.user.last_name = "";
		$rootScope.user.email = '';
		$rootScope.user.account_id = false;
		$rootScope.user.isAuthorized = false;
		$rootScope.user.isAuthenticated = false;

		factory.userProfile = {};

		factory.setHost =  function(host){
			that.config.host = host;
		};

		factory.getHost = function(){
			return that.config.host;
		};

		factory.setToken = function(token)
		{
			that.config.token = token;
			mwCookies.set('token',token);
		};

		factory.getToken = function(token)
		{
			return that.config.token;
		};

		factory.updateUserCookies = function(userObj){
			var user = mwCookies.get('user');
			_.each(userObj, function(value, key){
				user[key] = value;
			});
			mwCookies.set('user',user);
		};

		factory.setUserAuthentication = function(data,isSilent){
			isSilent = (typeof isSilent === 'undefined')?false:isSilent;
			this.setToken(data.data.auth_key.access_token);
			that.config.isAuthenticated=true;
			mwCookies.set('user',data.data.user);
			mwCookies.set('role',data.data.user_role[0]);

			$rootScope.user.user_id = data.data.user.id;
			$rootScope.user.email = data.data.user.email;
			$rootScope.user.first_name = data.data.user.first_name;
			$rootScope.user.last_name = data.data.user.last_name;
			$rootScope.user.username = data.data.user.username;
			$rootScope.user.role = data.data.user_role[0];
			$rootScope.user.is_guest = data.data.user.is_guest;
			$rootScope.user.isAuthenticated=true;

			if(!isSilent)
			{
				$rootScope.$broadcast('event:auth:successful');
			}
		};

		factory.isAuthenticated = function(){
			
			if(!that.config.isAuthenticated)
			{
				if(mwCookies.get("token"))
				{
					console.log("found token thus setting: "+mwCookies.get("token"));
					this.setToken(mwCookies.get("token"));
					that.config.isAuthenticated=true;
					var user = mwCookies.get("user");
					var role = mwCookies.get("role");

					console.log(user);
					$rootScope.user.user_id = user.id;
					$rootScope.user.first_name = user.first_name;
					$rootScope.user.last_name = user.last_name;
					$rootScope.user.email = user.email;
					$rootScope.user.username = user.username;
					$rootScope.user.is_guest = user.is_guest;
					$rootScope.user.role = role;
					$rootScope.user.isAuthenticated=true;
					return true;
				}
			}
			
			return that.config.isAuthenticated;
		};

		factory.authenticateOrCreate = function(){
			var deferred = $q.defer();
			if(this.isAuthenticated() === true)
			{
				deferred.resolve(true);
			}
			else
			{
				this.createUniqueIdentifier().then(function(){
					deferred.resolve(true);	
				});
			}
			return deferred.promise;
		};

		// TBD
		factory.login = function(credentials){
			return $http
				.post(that.config.host+'/session',credentials)
				.then(function(ret){
					//console.log(ret);

					if(ret.data.user_role[0].name==='guest')
					{
						factory.setUserAuthentication(ret,true);
					}
					else
					{
						factory.setUserAuthentication(ret);
					}
					
					return ret;
				},function(res){
					//$rootScope.$broadcast('event:auth:loginFailed');
					//factory.logout();
					return res;
				});
		};

		// TBD
		factory.signup = function(credentials){
			return $http
				.post(that.config.host+'/users',credentials)
				.then(function(ret){
					$rootScope.isNewSignedUpUser = true;
					factory.setUserAuthentication(ret);
					factory.userProfile = ret.data.user;
					return ret;
				},function(res){
					//factory.logout();
					return res;
				});
		};

		factory.signupProfile = function(credentials){
			return $http
				.post(that.config.host+'/user_profiles',credentials)
				.then(function(ret){
					return ret;
				},function(res){
					//factory.logout();
					return res;
				});
		};

		// TBD
		factory.checkEmailDuplicate = function(email){
			return $http.get(that.config.host+'/users/dup_checker?email='+email);
		};

		// TBD
		factory.forgot_password = function(email){
			return $http
				.post(that.config.host+'/password_resets',{"email": email})
				.then(function(ret){
					return ret;
				},function(res){
					return res;
				});
		};

		// TBD
		factory.verify_password_reset_token = function(token){
			return $http
				.get(that.config.host+'/password_resets/'+token)
				.then(function(ret){
					return ret;
				},function(res){
					return res;
				});
		};

		// TBD
		factory.reset_password = function(token,password,password_confirmation){
			return $http
				.put(that.config.host+'/password_resets/'+token,{'password': password, 'password_confirmation': password_confirmation})
				.then(function(ret){
					return ret;
				},function(res){
					return res;
				});
		};

		factory.logout = function(){
			$rootScope.user = {};
			$rootScope.user.user_id = false;
			$rootScope.user.account_id = false;
			$rootScope.user.isAuthorized = false;
			$rootScope.user.isAuthenticated = false;
			$rootScope.user.first_name = "";
			$rootScope.user.last_name = "";
			$rootScope.user.email = "";

			this.setToken("");
			that.config.isAuthenticated=false;

			mwCookies.remove("token");
			mwCookies.remove("user"); 
			mwCookies.remove('role');
			mwCookies.remove('uniqueIdentifier');

			$rootScope.$broadcast('event:auth:logout');
		};

		factory.createUniqueIdentifier = function(){

			var deferred = $q.defer();
			var identifier = mwCookies.get("uniqueIdentifier");
			if (identifier)
			{
				$rootScope.uniqueIdentifier = identifier;
				deferred.resolve(identifier);
			}
			else
			{
				return $http
				.post(that.config.host+'/users/create_guest')
				.then(function(ret){
					var uniqueIdentifier = ret.data.user.email;
					mwCookies.put('uniqueIdentifier',uniqueIdentifier);
					factory.setUserAuthentication(ret,true);
					deferred.resolve(uniqueIdentifier);
				},function(res){
					deferred.reject(res);
				});
			}
			return deferred.promise;
		};

		return factory;
	}];
})

.config(['$httpProvider','nbAuthProvider', function($httpProvider,nbAuthProvider) {
	delete $httpProvider.defaults.headers.common["X-Requested-With"];
	
	// Enable below to send cookies with every http request.
	//$httpProvider.defaults.withCredentials = true;

	$httpProvider.interceptors.push(['$rootScope', '$q', function($rootScope, $q) {
		//var deferred = $q.defer();
		return {
			request: function(config) {
				//console.log(config);
				config.headers.Authorization = nbAuthProvider.getToken();
				//config.timeout = deferred.promise;
				// do something on success
				return config;
			},
			responseError: function(rejection) {
						if (!rejection.config.ignoreAuthModule) {
							switch (rejection.status) {
								case 401:

									console.log("not authorized 401 called");
									$rootScope.$broadcast('event:auth:loginFailed', rejection);
					break;
								case 403:
									$rootScope.$broadcast('event:auth:forbidden', rejection);
									//deferred.resolve("Forbidden");
									break;
								case 500:
					console.log("500 status somethings wrong");
					$rootScope.$broadcast('event:auth:ServerCrash', rejection);
					break;
							}
						}
						// otherwise, default behaviour
						return $q.reject(rejection);
					}
		};
	}]);

}])

.run(function ($modal,$rootScope,$injector,$state,nbAuth,socket) {

	$rootScope.$on('$stateChangeStart', function (event, next) {
		console.log("stateChangeInterceptor");
		//console.log(next);
		//console.log(next.url);
		// Running this function will automatically authenticate user from cookies
		nbAuth.isAuthenticated();

		if (next.url === '/login' && nbAuth.isAuthenticated()){
				// User is authenticated - No need for Login
				$state.go("home.tickets");
				event.preventDefault();
			}

		if(typeof(next.isPublic)!=='undefined' && next.isPublic===true){
			console.log("public page found: "+next.url);
			return;
		}

		if(!nbAuth.isAuthenticated())
		{
			console.log("User not authenticated");
			event.preventDefault();
			$rootScope.$broadcast("event:auth:error");
			//$rootScope.loginModal();
			$state.go("public.landing");
		}
		else
		{
			// User is authenticated thus let him view the page.
			// Todo: check for user roles later once we get access to api.
		}

	});

	$rootScope.$on('event:auth:successful',function(){
		console.log("user is online");
		socket.emit('online', $rootScope.user);

		if($rootScope.user.role.name === 'expert')
		{
			//$state.go("home.tickets");
			$state.go("expert.dashboard");
		}
		else if ($rootScope.user.role.name === 'customer')
		{
			$state.go("home.my-questions");
		}
		else if($rootScope.user.role.name === 'writer' || $rootScope.user.role.name === 'editor')
		{
			$state.go("home.articles");
		}
		else if($rootScope.user.role.name === 'admin' || $rootScope.user.role.name === 'editor')
		{
			$state.go("admin.chatbot");
		}
	});

	$rootScope.$on('event:auth:logout',function(){
		$state.go("public.landing");
	});

});