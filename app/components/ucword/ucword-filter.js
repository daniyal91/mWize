angular.module('app').filter('ucword', function() {
  return function(input,arg) {
    input = input || '';
    var out = "";
    input = input.toLowerCase();
    out = input.charAt(0).toUpperCase();
    for (var i = 1; i < input.length; i++) {
      out += input.charAt(i).toLowerCase();
    }
    return out;
  };
});