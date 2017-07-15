var app = angular.module('coachIn', ['socialLogin']);

app.controller('coachInController', ['$scope', '$http', 'socialLoginService', function($scope, $http, socialLoginService) {
	$scope.session = false;
	var user = window.localStorage.getItem('coachInUser');
	if (!user) {
		window.location = "/login/index.html";
		return;
	}
	$scope.user = JSON.parse(user);
    $scope.logout = socialLoginService.logout;

    $scope.selectedCategory = null, $scope.selectedDay = null;

    $http.get('http://tutorin-ghci.rhcloud.com/get/categories').then(function(response){
        $scope.categories = response.data;
    });

    $scope.days = [{
    	_id: 0,
    	name: 'Sunday'
    }, {
    	_id: 1,
    	name: 'Monday'
    }, {
    	_id: 2,
    	name: 'Tuesday'
    }, {
    	_id: 3,
    	name: 'Wednesday'
    }, {
    	_id: 4,
    	name: 'Thursday'
    }, {
    	_id: 5,
    	name: 'Friday'
    }, {
    	_id: 6,
    	name: 'Saturday'
    }];

    $('.select2').select2();

    $scope.searchTutors = function() {
    	$http.get(`http://tutorin-ghci.rhcloud.com/get/tutors?pref=${$scope.selectedCategory}&day=${$scope.selectedDay}`).then((response) => {
    		var data = response.data;
    		$scope.tutors = [];
    		data.forEach((t)=> {
    			if (t.__id != $scope.user._id) {
	    			t.availability.tutor.forEach((a) => {
	    				if (a.day != $scope.selectedDay) return;
	    				a.start = "12:30 PM";
	    				a.end = "2:30 PM";
	    				a.day = $scope.days[a.day].name;
	    				$scope.tutors.push(Object.assign({}, t, { availability: a } ));
	    			});
	    		}
    		});
    	});
    };	

    $scope.selectTutor = function(tutor) {
    	var session = {
    		startTime: tutor.availability.start,
    		endTime: tutor.availability.end,
    		day: tutor.availability.day,
    		status: 'pending',
    		accepted: false,
    		createdAt: (new Date()).getTime(),
    		tutor_id: tutor._id,
    		tutee_id: $scope.user._id,
    		tutorFirstName: tutor.firstName,
    		tutorLastName: tutor.lastName,
    		tuteeFirstName: $scope.user.firstName,
    		tuteLastName: $scope.user.lastName
    	};

    	$http.post(`http://tutorin-ghci.rhcloud.com/post/session`, session).then(() => {
    		$scope.session = true;
    		$('body').scrollTop(0);
    		$scope.tutors = null;
    		$scope.selectedDay = null;
    		$scope.selectedCategory = null;
    		fetchSessions();
    	});
    };

   	var fetchSessions = () => {
   		$scope.sessions = null;
   		$http.get(`http://tutorin-ghci.rhcloud.com/get/tutee/${$scope.user._id}/sessions?status=pending`).then(function(response) {
	        $scope.sessions = response.data;
	    });
   	}

   	fetchSessions();
}]);