var formApp = angular.module('formApp', []);
formApp.controller('formController', function($scope, $http) {
    $http.get('http://tutorin-ghci.rhcloud.com/get/tutor/5969b1610274267626000001').then(function(response){
        window.localStorage.setItem('coachInUser', JSON.stringify(response.data));
        $scope.user = response.data;
    });
    $scope.updateData =  function() {
        $http.post('http://tutorin-ghci.rhcloud.com/post/user/'+$scope.user._id, $scope.user).then(function(response){
           JSON.stringify(window.localStorage.setItem('coachInUser', $scope.user));
        });
    }
});
