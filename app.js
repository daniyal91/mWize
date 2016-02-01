angular.module('app', ['ui.bootstrap','ui.utils','ui.router','ngAnimate','nb.auth','ui.knob', 'angularFileUpload','ngResource', 'ngCookies', 'textAngular', 'btford.socket-io', 'ui.tree', 'base64', 'ui.slider','angular-bootstrap-select','perfect_scrollbar','frapontillo.bootstrap-switch']);

angular.module('app').config(function($stateProvider, $urlRouterProvider, nbAuthProvider, appConfig) {

  nbAuthProvider.setHost(appConfig.apiURL);

  $stateProvider.state('home', {
    url: '/home',
    views:{
      'root':{
        templateUrl: 'app/application/application.html'
      },
      'application':{
        templateUrl: 'app/home/home.html'
      }
    }
  });

  $stateProvider.state('public', {
    url: '',
    abstract: true,
    isPublic:true,
    views:{
      'root':{
        templateUrl: 'app/application/full-template.html'
      }
    }
  });


  $stateProvider.state('public.chattest', {
    url: '/chattest',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/components/chat-bubble-output/chat-bubble-test.html'
      }
    }
  });

	$stateProvider.state('expert', {
    url: '',
    abstract: true,
    isPublic:false,
    views:{
      'root':{
        templateUrl: 'app/application/expert-template.html'
      }
    }
  });

  $stateProvider.state('expert.dashboard', {
    url: '/expert-dashboard',
    isPublic:false,
    views:{
      'application':{
        templateUrl: 'app/expert-dashboard/expert-dashboard.html'
      }
    }
  });



  $stateProvider.state('admin', {
    url: '',
    abstract: true,
    isPublic:true,
    views:{
      'root':{
        templateUrl: 'app/admin/admin.html'
      }
    }
  });
  
  $stateProvider.state('public.landing', {
    url: '/landing/:email',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/landing-page/landing-page.html'
      }
    }
  });

  $stateProvider.state('public.login', {
    url: '/login',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/login/login.html'
      },
    }
  });

  $stateProvider.state('public.askASpecialist', {
    url: '/ask-a-specialist/:id',
    // isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/ask-a-specialist/ask-a-specialist.html'
      }
    }
  });

  $stateProvider.state('home.expert-signup', {
    url: '/expert/signup',
    views:{
      'application':{
        templateUrl: 'app/expert-signup/expert-signup.html'
      }
    }
  });
  
  $stateProvider.state('home.tickets', {
    url: '/tickets',
    views:{
      'application':{
        templateUrl: 'app/tickets/tickets.html'
      }
    }
  });

  $stateProvider.state('home.ticket-details', {
    url: '/tickets/:id',
    views:{
        'application':{
            templateUrl: 'app/tickets/ticket-details/ticket-details.html'
        }
    }
  });

  $stateProvider.state('home.articles', {
    url: '/articles',
    views:{
      'application':{
        templateUrl: 'app/articles/articles.html'
      }
    }
  });

	$stateProvider.state('home.my-questions', {
		url: '/myquestions',
		views:{
			'application':{
				templateUrl: 'app/my-questions/my-questions.html'
			}
		}
	});

  /*$stateProvider.state('admin.home', {
      url: '/admin',
      views:{
          'application':{
              templateUrl: 'app/admin/admin.html'
          }
      }
  });*/


  $stateProvider.state('admin.chatbot', {
    url: '/admin/chatbot',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/admin/chatbot/chatbot-admin.html'
      }
    }
  });

  $stateProvider.state('admin.expertsignup', {
    url: '/admin/expertsignup',
    // isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/admin/users/users.html'
      }
    }
  });

  $stateProvider.state('admin.expertlisting', {
    url: '/admin/listexperts',
    // isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/admin/users/list-users.html'
      }
    }
  });

  /*$stateProvider.state('signup', {
      url: '/signup',
      abstract: true,
      views:{
          'root':{
              template: '<ui-view/>'
          }
      }
  });*/

  $stateProvider.state('public.signup-step1', {
    url: '/signup/step1',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/signup/step1/signup-step-1.html'
      }
    }
  });

  $stateProvider.state('public.signup-step2', {
    url: '/signup/step2/:id',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/signup/step2/signup-step-2.html'
      }
    }
  });

  $stateProvider.state('public.signup-quiz', {
    url: '/signup/quiz/:id',
    isPublic:true,
    views:{
      'application':{
        templateUrl:'app/signup/quiz/quiz.html'
      }
    }      
  });

  $stateProvider.state('public.categories', {
    url: '/categories',
    isPublic: true,
    views:{
      'application':{
        templateUrl:'app/categories/step1/categories.html'
      }
    }
  });

  $stateProvider.state('public.categories-step2', {
    url: '/categories/ticket/new/:category',
    isPublic: true,
    views:{
      'application':{
        templateUrl: 'app/categories/step2/categories-step2.html'
      }
    }
  });
  
  $stateProvider.state('home.uploadImage', {
    url: '/uploadImage',
    views:{
      'application':{
        templateUrl: 'app/uploadImage/uploadImage.html'
      }
    }
  });

  $stateProvider.state('users', {
        url: 'admin/signup',
        templateUrl: 'app/admin/users/users.html'
    });

  $stateProvider.state('public.html-testing', {
    url: '/html-testing',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/html-testing/html-testing.html'
      }
    }
  });

  $stateProvider.state('public.forgot-password', {
    url: '/forgot-password',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/forgot-password/forgot-password.html'
      }
    }
  });

  $stateProvider.state('public.reset-password', {
    url: '/reset-password/:token',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/reset-password/reset-password.html'
      }
    }
  });

  // Only to TEST active questions
  $stateProvider.state('public.active-question', {
    url: '/activequestion',
    isPublic:true,
    views:{
      'application':{
        templateUrl: 'app/active-question/active-question.html'
      }
    }
  });

  /* Add New States Above */
  $urlRouterProvider.otherwise( function($injector) {
      var $state = $injector.get("$state");
      $state.go("public.landing");
  });
  // $urlRouterProvider.otherwise('/login');
});

angular.module('app').run(function($rootScope) {
  $rootScope.safeApply = function(fn) {
    var phase = $rootScope.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof(fn) === 'function')) {
        fn();
      }
    } else {
      this.$apply(fn);
    }
  };
});


angular.module('app').config(['$provide', function($provide){
  $provide.decorator('taOptions', ['taRegisterTool', '$modal', '$delegate', function(taRegisterTool, $modal, taOptions){
    taOptions.toolbar = [
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote'],
      ['bold', 'italics', 'underline', 'strikeThrough', 'ul', 'ol', 'redo', 'undo', 'clear'],
      ['justifyLeft', 'justifyCenter', 'justifyRight', 'indent', 'outdent'],
      ['html', 'insertLink', 'insertVideo', 'wordcount', 'charcount']
    ];

    taRegisterTool('customInsertImage', {
      iconclass: "fa fa-picture-o",
      action: function($deferred, restoreSelection){
        var textAngular = this;
        var modalInstance = $modal.open({
          controller: "UploadimageCtrl",
          templateUrl: "app/uploadImage/uploadImage.html"
        });

//                For single image upload

//                modalInstance.result.then(function(imgUrl) {
//                    restoreSelection();
//                    textAngular.$editor().wrapSelection('insertImage', imgUrl);
//                    $deferred.resolve();
//                });

//                For multiple image upload

        modalInstance.result.then(function(imageUrl) {
          restoreSelection();
          if(typeof(imageUrl) === "string"){
            textAngular.$editor().wrapSelection('insertImage', imageUrl);
          }
          else{
            _.each(imageUrl, function(images){
              textAngular.$editor().wrapSelection('insertImage', images);
            });
          }
          $deferred.resolve();
        });
        return false;
      }
    });

    taOptions.toolbar[3].push('customInsertImage');
    return taOptions;
  }]);

}]);


angular.module('app').value('ticketStatus',{
	open:0,
	waiting_for_expert:1,
	in_progress_by_expert:2,
	completed_by_expert:3,
	resolved_by_user:4,
	reopened:5
});

angular.module('app').value('expertiseLevel',{
	novice: 0,
	intermediate: 1,
	expert: 2
});
//angular.module('app').constant('_', window._);

angular.module('app').value('ticketStatusEnum',{
		NewComment: {
			value: "NEWCOMMENT",
			cssclass: "unread-question"
		},
		Opened: {
			value: "OPENED",
			cssclass: "active-question"
		},
		Closed: {
			value: "CLOSED",
			cssclass: "question"
		}
});

