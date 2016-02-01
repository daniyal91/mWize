// Set your production environment here
angular.module('app').constant('appConfig', {
	env:'production',
	ver: '0.0.1', 
  protocol: 'http://',
	apiHost: 'ec2-54-145-58-233.compute-1.amazonaws.com',
	apiURL: 'http://ec2-54-145-58-233.compute-1.amazonaws.com/api',
	chatHost: 'http://ec2-54-145-58-233.compute-1.amazonaws.com:9001'
});