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
    		var email = {
                to: [session.tutee_email], /* a string array containing the recipient email addresses */
                from: "chiragsanghvi24", /* email id of user */
                subject: accepted ? "Tutoring request approved" : "Tutoring request rejected" , /* string containing the subject of the email */
                templateName: accepted ? "session_approve" : "session_reject", /*name of template to be send */
                data: session, /*an object with placeholder names and their data eg: {username:"test"} */
                useConfig: false/* set true to use configure settings in email module in SDK*/
            };

            $scope.session = true;
            Appacitive.Email.sendTemplatedEmail(email);
            setTimeout(() => {
	    		$scope.sessionSuccess = false;
	    	}, 1000);
    	});
    };

    $scope.sessions = null;
   	$http.get(`http://tutorin-ghci.rhcloud.com/get/tutor/${$scope.user._id}/sessions`).then(function(response) {
        $scope.sessions = response.data.reverse();
    });
}]);