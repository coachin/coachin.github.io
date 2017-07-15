var app = angular.module('coachIn', ['socialLogin']);

app.controller('coachInController', ['$scope', '$http', 'socialLoginService', function($scope, $http, socialLoginService) {
	var user = window.localStorage.getItem('coachInUser');
	if (!user) {
		window.location = "/login/index.html";
		return;
	}
	$scope.user = JSON.parse(user);
    $scope.logout = socialLoginService.logout;

}]);