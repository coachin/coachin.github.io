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

socialLogin.directive("linkedIn", ['$rootScope', 'social', 'socialLoginService', '$window',
	function($rootScope, social, socialLoginService, $window){
	return {
		restrict: 'EA',
		scope: {},
		link: function(scope, ele, attr){
		    ele.on("click", function(){
		  		IN.User.authorize(function(){
					IN.API.Raw("/people/~:(id,first-name,last-name,email-address,picture-url)").result(function(res){
						socialLoginService.setProvider("linkedIn");
						var userDetails = {name: res.firstName + " " + res.lastName, email: res.emailAddress, uid: res.id, provider: "linkedIN", imageUrl: res.pictureUrl};
						$rootScope.$broadcast('event:social-sign-in-success', userDetails);
				    });
				});
			})
		}
	}
}])