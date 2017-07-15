"use strict";

var socialLogin = angular.module('socialLogin', []);

socialLogin.provider("social", function(){
	var fbKey, fbApiV, googleKey, linkedInKey;
	return {
		setLinkedInKey: function(value){
			linkedInKey = value;
			var lIN, d = document, ref = d.getElementsByTagName('script')[0];
			lIN = d.createElement('script');
			lIN.async = false;
			lIN.src = "//platform.linkedin.com/in.js";
			lIN.text = ("api_key: " + linkedInKey).replace("\"", "");
	        ref.parentNode.insertBefore(lIN, ref);
	    },
		$get: function(){
			return { 
				linkedInKey: linkedInKey
			}
		}
	}
});

socialLogin.factory("socialLoginService", ['$window', '$rootScope',
	function($window, $rootScope){
	return {
		logout: function(){
			var provider = $window.localStorage.getItem('_login_provider');
			
			IN.User.logout(function(){
				$window.localStorage.removeItem('_login_provider');
			 	$rootScope.$broadcast('event:social-sign-out-success', "success");
			}, {});
		},
		setProvider: function(provider){
			$window.localStorage.setItem('_login_provider', provider);
		}
	}
}]);

socialLogin.directive("linkedIn", ['$rootScope', 'social', 'socialLoginService', '$window', '$http',
	function($rootScope, social, socialLoginService, $window, $http) {
	return {
		restrict: 'EA',
		scope: {},
		link: function(scope, ele, attr) {
		    ele.on("click", function() {
		    	$rootScope.errorMessage = false;

		  		IN.User.authorize(function() {
					IN.API.Profile('me').fields(["id","email-address","picture-url","first-name","last-name","headline","industry","location","summary","public-profile-url"]).result((res) => { 
						socialLoginService.setProvider("linkedIn");

						res = res.values[0];

						var userDetails = {
							firstName: res.firstName,
							lastName: res.lastName, 
							email: res.emailAddress,
							uid: res.id, 
							provider: "linkedIN", 
							pictureUrl: res.pictureUrl,
							resumeUrl: res.publicprofileUrl,
							isTutor: false
						};
						$http.post('https://tutorin-ghci.rhcloud.com/post/user', userDetails).then(({ data: user }) => {
							$window.localStorage.setItem('coachInUser', JSON.stringify(user));
							
							if (user.exists) {
								window.location = "/index.html";
							} else {
								window.location = "/profile/index.html";
							}
							
						}, (err) => {
							console.log(err.message);
							$rootScope.errorMessage = "There was an error. Please check your login information."
						});
					});
				});
			});
		}
	}
}])