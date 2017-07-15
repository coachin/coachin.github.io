var formApp = angular.module('formApp', ['socialLogin']);

formApp.controller('formController', ['$scope', '$http', 'socialLoginService', function($scope, $http, socialLoginService) {
	var user = window.localStorage.getItem('coachInUser');
    if (!user) {
    	window.location = "/login/index.html";
    	return;
    }
    $scope.user = JSON.parse(user);
    
    $scope.logout = socialLoginService.logout;

    $scope.updateData =  function() {
    	var id = $scope.user._id;
    	delete $scope.user._id;
        $http.post('http://tutorin-ghci.rhcloud.com/post/user/' + id, $scope.user).then(function(response) {
        	$scope.user._id = id;
        	window.localStorage.setItem('coachInUser', JSON.stringify($scope.user));
        });
    }
}]);
