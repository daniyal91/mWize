angular.module('app').factory('quizService',function($http,$q,nbAuth) {

	var quizService = {};
	quizService.questions = [];
	quizService.currentQuestionPointer = 0;
	quizService.currentQuestion = null;
	quizService.correctAnswers = 0;
	quizService.incorrectAnswers = 0;

	quizService.categories = [];
	quizService.currentCategoryPointer = 0;
	quizService.currentCategory = null;
	quizService.category_questions = [];

	quizService.currentPointer = function(){
		return this.currentQuestionPointer;
	};

	quizService.getQuestions = function(profile){
		var deferred = $q.defer();
		var that = this;
		$http.get(nbAuth.getHost()+'quiz_questions?profile='+profile)
		  .then(function(data) {
				that.questions = data.data.quiz_questions;
				var categories = data.data.expertises;
				var category_ids = [];

				_(that.questions).forEach(function(question) {
					category_ids.push(question.expertise_id);
				});

				category_ids = _.uniq(category_ids);
				_(category_ids).forEach(function(category) {
					that.categories.push(_.where(categories, { 'id': category }));
				});
				
				that.categories = _.flatten(that.categories);

				deferred.resolve(data);
      },
      function(data){
				deferred.reject(data);
      });

	return deferred.promise;
	};

	quizService.totalQuestions = function(){
		// return this.questions.length;
		return this.category_questions.length;
	};

	quizService.totalCategories = function(){
		return this.categories.length;
	};

	quizService.hasNext = function(){
		// if(this.currentQuestionPointer < this.questions.length - 1)
		if(this.currentQuestionPointer < this.category_questions.length - 1)
		{
			return true;
		}
		else
		{
			return false;
		}
	};

	quizService.hasNextCategory = function(){
		if(this.currentCategoryPointer < this.categories.length - 1)
		{
			return true;
		}
		else
		{
			return false;
		}
	};

	quizService.checkAnswer = function(answer){
		if(this.currentQuestion.answer===answer)
		{
			this.correctAnswers++;
		}
		else
		{
			this.incorrectAnswers++;
		}
	};
	
	quizService.resetQuestionAttributes = function() {
		quizService.currentQuestionPointer = 0;
		this.category_questions.length = 0;
		quizService.correctAnswers = 0;
		quizService.incorrectAnswers = 0;		 
		this.categories = _.uniq(this.categories, function(item, key, name){
			return item.name;
	  });
	};

	quizService.resetCategoryAttributes = function() {
		quizService.categories.length = 0;
		quizService.currentCategoryPointer = 0;
		quizService.currentCategory = null;
		quizService.category_questions = [];
	};

	quizService.firstQuestion = function(category){
		// this.currentQuestion = this.questions[this.currentQuestionPointer];
		// return this.currentQuestion;
		// var category_questions = [];
		quizService.resetQuestionAttributes();
		var that = this;
		_(this.questions).forEach(function(question) {
			if(question.expertise_id===category.id)
			{
				that.category_questions.push(question);
			}
		 });
		this.currentQuestion = this.category_questions[this.currentQuestionPointer];
		return this.currentQuestion;
	};

	quizService.firstCategory = function(){
		this.currentCategory = this.categories[this.currentCategoryPointer];
		return this.currentCategory;
	};

	quizService.nextQuestion = function(){
		if(this.hasNext())
		{
			this.currentQuestionPointer++;
			this.currentQuestion = this.category_questions[this.currentQuestionPointer];
			return this.currentQuestion;
		}
		else
		{
			return false;
		}

	};

	quizService.nextCategory = function(){
		if(this.hasNextCategory())
		{
			this.currentCategoryPointer++;
			this.currentCategory = this.categories[this.currentCategoryPointer];
			return this.currentCategory;
		}
		else
		{
			return false;
		}
	};

	quizService.saveQuizResult = function(result){
		var deferred = $q.defer();
		$http.post(nbAuth.getHost()+'quiz_results',result)
	  .then(function(data) {
			deferred.resolve(data);
    },
    function(data){
			deferred.reject(data);
    });
	};

	return quizService;
});