var preferenceApp = angular.module('preferenceApp', []);
preferenceApp.controller('preferenceController', function($scope, $http) {
    $scope.user = JSON.parse(window.localStorage.getItem('coachInUser'));
    $http.get('http://tutorin-ghci.rhcloud.com/get/categories').then(function(response){
        $scope.categories = response.data;
    });
    $scope.selected = [];
    var url = 'http://tutorin-ghci.rhcloud.com/get/';
    if ($scope.user.isTutor) {
        url = url + 'tutor/' + $scope.user._id + '/pref';
    } else {
        url = url + 'tutee/' + $scope.user._id + '/pref';
    }
    $http.get(url).then(function(response) {
        $scope.selected = response.data;
    })
    
    $scope.updateData =  function() {
        var url = 'http://tutorin-ghci.rhcloud.com/post/';
        if ($scope.user.isTutor) {
            url = url + 'tutor/' + $scope.user._id + '/pref';
        } else {
            url = url + 'tutee/' + $scope.user._id + '/pref';
        }
        $http.post(url, $scope.selected).then(function(response){
           //window.location('') Redirect
        });
    }
});