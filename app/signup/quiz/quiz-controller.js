angular.module('app').controller('QuizCtrl',function($scope,$log,$interval,$state,quizService,$rootScope){

	$scope.quiz = {};
	$scope.quiz.showStart = true;
	$scope.quiz.showQuiz = false;
	$scope.quiz.showResults = false;
	$scope.knobData = 120; 
	
	$scope.quizService = quizService;

	var profileId = _.values($state.params);
  $scope.profileId = _.first(profileId);

	quizService.getQuestions($scope.profileId).then(function(data){
		$scope.questions = data.data.quiz_questions;
		$scope.currentCategory = quizService.firstCategory();
		$scope.currentQuestion = quizService.firstQuestion($scope.currentCategory);
		$scope.categoriesForTest = quizService.categories;
	});
	
	
	$scope.Math = window.Math;

	$scope.startQuiz = function () {
		$scope.quiz.showStart=false;		   
		$scope.quiz.showQuiz=true;	
		$scope.startTimer();
	};

	$scope.startTimer = function(){
		$scope.knobData = 120;
		$scope.timer = $interval(function(){
			$scope.knobData -= 1;
			if($scope.knobData===0)
			{
				$scope.showNextQuestion();
				quizService.incorrectAnswers++;
			}
		},1000,120);
	};

	$scope.stopTimer = function(){
		$interval.cancel($scope.timer);	
	};

	$scope.restartTimer = function(){
		$scope.stopTimer();
		$scope.startTimer();
	};

	$scope.showNextQuestion = function(){
		if(quizService.hasNext())
		{
			$scope.restartTimer();
			$scope.currentQuestion = quizService.nextQuestion();
		}else
		{
			$scope.quiz.showQuiz=false;
			$scope.quiz.showResults=true;
			$log.info("This was the last answer lets show results");
		}
	};

	$scope.selectAnswer = function(key,value){
		quizService.checkAnswer(value);
		$scope.showNextQuestion();
		$log.info("Selected "+key+":"+value);
	};

	$scope.login = function(){
		$state.go('public.login');
	};

	$scope.closeQuiz = function(){
		var nextCategory = quizService.nextCategory();
		var result;
		if(nextCategory)
		{
			result = $scope.calculateResult();
			$scope.saveQuizReult(result);

			$scope.currentCategory = nextCategory;
			$scope.currentQuestion = quizService.firstQuestion($scope.currentCategory);
			$scope.startQuiz();
			$scope.quiz.showResults = false;
		}
		else
		{
			$scope.login();
			quizService.resetCategoryAttributes();

			result = $scope.calculateResult();
			$scope.saveQuizReult(result);
		}
	};

	$scope.calculateResult = function(){
		var passed;
		if(quizService.correctAnswers>quizService.incorrectAnswers)
			{
				passed = true;
			}
			else
			{
				passed = false;
			}
			var result = {
										correct: quizService.correctAnswers,
										incorrect: quizService.incorrectAnswers,
										expertise_id: $scope.currentCategory.id,
										passed: passed,
										user_id: $rootScope.user.user_id
									 };
		  return result;
	};

	$scope.saveQuizReult = function(result){
		quizService.saveQuizResult(result);
	};

	//$scope.startQuiz();
});