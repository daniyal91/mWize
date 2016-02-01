angular.module('app').factory('helperFunctions',function($timeout) {

  var helperFunctions = {};

  helperFunctions.getRandomInt = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  helperFunctions.scrollToBottom = function(timeout){
    $timeout(function(){
      $(".chat-box-scroll").animate({ scrollTop: $('.chat')[0].scrollHeight}, 500);
      $("html, body").animate({ scrollTop: $(document).height()-$(window).height() });
    },timeout);
  };

  helperFunctions.strSplit = function(str,maxLength){
    var words = str.split(" ");
    var normalizedWords = [];
    for(var i in words)
    {
      if(words[i].length > maxLength)
      {
        var subWords = words[i].split("");
        var ctr=0;
        var newWord="";
        for(var j in subWords)
        {
          newWord += subWords[j];
          ctr++;

          if(ctr===(maxLength-1))
          {
            normalizedWords.push(newWord);
            newWord="";
            ctr=0;
          }
        }

        if(newWord.length>0){
          normalizedWords.push(newWord);
          newWord="";
        }

      }
      else
      {
        normalizedWords.push(words[i]);
      }
    }

    return normalizedWords.join(" ");
  };

  helperFunctions.ucfirst = function(str) {
	  str += '';
	  var f = str.charAt(0)
	    .toUpperCase();
	  return f + str.substr(1);
	};

  return helperFunctions;
});