angular.module('app').factory('socket',function(socketFactory,appConfig) {
  return socketFactory({
	prefix: 'connection',
    ioSocket: io.connect(appConfig.chatHost)
  });
});