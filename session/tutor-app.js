var app = angular.module('coachIn', ['socialLogin']);

app.controller('coachInController', ['$scope', '$http', 'socialLoginService', function($scope, $http, socialLoginService) {
	$scope.sessionSuccess = false;
	var user = window.localStorage.getItem('coachInUser');
	if (!user) {
		window.location = "/login/index.html";
		return;
	}
	$scope.user = JSON.parse(user);
    $scope.logout = socialLoginService.logout;

    $scope.changeSession = function(session, accepted) {
        session.accepted = accepted;
        session.status = "completed";
        var id = session._id;
        delete session._id;
    	$http.post(`http://tutorin-ghci.rhcloud.com/post/session/${id}`, session).then(() => {
    		$scope.sessionSuccess = true;
    		setTimeout(() => {
	    		$scope.sessionSuccess = false;
	    	}, 1000);
    	});
    };

    $scope.sessions = null;
   	$http.get(`http://tutorin-ghci.rhcloud.com/get/tutor/${$scope.user._id}/sessions`).then(function(response) {
        $scope.sessions = response.data;
    });
}]);