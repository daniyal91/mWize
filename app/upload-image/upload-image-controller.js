angular.module('app').controller('UploadimageCtrl', function ($scope, $modalInstance, uploadImageService, nbAuth, $upload) {
    $scope.imageUrl = {url: ''};

//For single image upload

//    $scope.uploadImage = function () {
//        if ($scope.imageUrl.url) {
//            $modalInstance.close($scope.imageUrl.url);
//        }
//        else {
//            var file = this.myImage;
//            file.original_filename = file.name;
//
//            var fd = new FormData();
//            fd.append('file', file);
//
//            uploadImageService.uploadImage(file).then(function (response) {
//                $modalInstance.close(nbAuth.getPublicHost() + response.data.file_name);
//            });
//        }
//    };


//For multiple image upload

    $scope.onFileSelect = function ($files) {
        var totalFilesUploaded = $files.length;
        if ($scope.imageUrl.url) {
            $modalInstance.close($scope.imageUrl.url);
        }
        else {
            for (var i = 0; i < totalFilesUploaded; i++) {
                var file = $files[i];
                fileProgress(file, totalFilesUploaded);
            }
        }
    };

    function fileProgress(file, totalFilesUploaded){
        var images = [];
        uploadImageService.uploadImage(file).then(function (response) {
            images.push(nbAuth.getPublicHost() + response.data.file_name);
            if (images.length === totalFilesUploaded) {
                $modalInstance.close(images);
            }
        });
      console.log('percent: ' + parseInt(100.0 * file.loaded / file.total));
    }

});
