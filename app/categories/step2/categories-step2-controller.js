angular.module('app').controller('CategoriesStep2Ctrl',function($scope,$upload,$http,$state,nbAuth,ticketService){

  $scope.newTicket = {file:"test.txt"};
  $scope.ticketSubmitted = false;
  var subcategoryId = _.values($state.params);
  $scope.subcategoryId = _.first(subcategoryId);
  $scope.isValidForm = false;
  
  $scope.createTicket = function(){
    var newTicket = {email: $scope.newTicket.email,
                     subject: $scope.newTicket.subject, content: $scope.newTicket.content,
                     attachment_id: $scope.attachment_id, category_id: $scope.subcategoryId};
    ticketService.resource.save(newTicket,function(data){
      $scope.ticketSubmitted = true;
    });
  };

  $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.
    for (var i = 0; i < $files.length; i++) {
      var file = $files[i];
      $scope.upload = $upload.upload({
        url: nbAuth.getHost()+'tickets/upload_file', //upload.php script, node.js route, or servlet url
        //method: 'POST' or 'PUT',
        //headers: {'header-key': 'header-value'},
        //withCredentials: true,
       // data: {myObj: $scope.myModelObj},
        file: file, // or list of files ($files) for html5 only
        //fileName: 'doc.jpg' or ['1.jpg', '2.jpg', ...] // to modify the name of the file(s)
        // customize file formData name ('Content-Disposition'), server side file variable name. 
        //fileFormDataName: myFile, //or a list of names for multiple files (html5). Default is 'file' 
        // customize how data is added to formData. See #40#issuecomment-28612000 for sample code
        //formDataAppender: function(formData, key, val){}
      }).then(fileProgress,fileSuccess);
      //.error(...)
      //.then(success, error, progress); 
      // access or attach event listeners to the underlying XMLHttpRequest.
      //.xhr(function(xhr){xhr.upload.addEventListener(...)})
    }
    /* alternative way of uploading, send the file binary with the file's content-type.
       Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
       It could also be used to monitor the progress of a normal http post/put request with large data*/
    // $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
  };

  function fileProgress(evt){
    console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
  }

  function fileSuccess(data){
    $scope.attachment_id = data.id;
    console.log(data);
  }
});