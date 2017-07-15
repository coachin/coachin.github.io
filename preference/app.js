var preferenceApp = angular.module('preferenceApp', []);
preferenceApp.controller('preferenceController', function($scope, $http) {
    $scope.user = JSON.parse(window.localStorage.getItem('coachInUser'));
    $http.get('http://tutorin-ghci.rhcloud.com/get/categories').then(function(response){
        $scope.categories = response.data;
        $('.timepicker').timepicker({
            showInputs: false
        });
    });
    $scope.selected = [];
    $scope.dateList = [{}];
    $scope.days = [
        {
            name: 'Sunday',
            _id: 0
        },
        {
            name: 'Monday',
            _id: 1
        },
        {
            name: 'Tuesday',
            _id: 2
        },
        {
            name: 'Wednesday',
            _id: 3
        },
        {
            name: 'Thursday',
            _id: 4
        },
        {
            name: 'Friday',
            _id: 5
        },
        {
            name: 'Saturday',
            _id: 6
        }
    ];
    var url = 'http://tutorin-ghci.rhcloud.com/get/';
    if ($scope.user.isTutor) {
        url = url + 'tutor/' + $scope.user._id + '/pref';
    } else {
        url = url + 'tutee/' + $scope.user._id + '/pref';
    }

    $http.get(url).then(function(response) {
        $scope.selected = response.data;
    });
    
    $scope.updateData =  function() {
        var url = 'http://tutorin-ghci.rhcloud.com/post/';
        if ($scope.user.isTutor) {
            url = url + 'tutor/' + $scope.user._id + '/pref';
        } else {
            url = url + 'tutee/' + $scope.user._id + '/pref';
        }
        $http.post(url, $scope.selected).then(function(response){
           //window.location('') Redirect
           console.log('success');
        });
    };
    $scope.addDay = function() {
        $scope.dateList.push({});
        setTimeout(function() {
            $('.timepicker').timepicker({
                showInputs: false
            });
        }, 500);
    }
    $scope.updateTime = function() {
        $scope.updateData();
        var url = 'http://tutorin-ghci.rhcloud.com/post/tutor/' + $scope.user._id + '/availability';
        $http.post(url, $scope.dateList).then(function(response) {
            console.log('success');
            window.location = '/index.html';
        });
    }
});