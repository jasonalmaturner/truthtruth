var app = angular.module('truth');

app.controller('mainCtrl', function($scope, playerService, $location) {

$scope.login = function() {
	authService.login().then(function(res) {
		$scope.getUser();
	}, function(err) {
		console.log(err)
	})
}

$scope.getUser = function() {
	authService.getUser().then(function(res){
		$scope.user = res;
	}, function(err) {
		console.log(err)
	})
}
$scope.getUser();

})