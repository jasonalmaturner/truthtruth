var app = angular.module('truth');

app.service('authService', function($http, $q) {

this.login = function(){
	var deferred = $q.defer();
	$http({
		method: 'GET',
		url: 'auth/facebook'
	}).then(function(res){
		console.log(res)
		deferred.resolve(res)
	}, function(err){
		deferred.reject(err)
	})
	return deferred.promise;
}

this.getUser = function(){
	var deferred = &q.defer();
	$http({
		method: 'GET',
		url: 'api/player'
	}).then(function(res){
		console.log(res);
		deferred.resolve(res)
	}, function(err){
		deferred.reject(err)
	})
	return deferred.promise;
}

})