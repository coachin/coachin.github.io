'use strict';

/* App Module */

var app = angular.module('login', ['socialLogin']);

app.config(function(socialProvider){
  socialProvider.setLinkedInKey("86md0yq90aqsiz");
});