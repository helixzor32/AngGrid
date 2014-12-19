var app = angular.module('EmployeeGrid.controllers', [])
.config(['$httpProvider', function($httpProvider) {
	delete $httpProvider.defaults.headers.common["X-Requested-With"]
}]);

app.filter('offset', function() {
  return function(input, start) {
    start = parseInt(start, 10);
    return input.slice(start);
  };
});

app.controller('employeeController', function($scope, $http) {
	$scope.employeeList = {};
	//Populate field list
	$http.get('http://localhost:8000/employees/barefields'	)
    .success(function (data, status, headers, config) {
		$scope.fieldList = data;
    })
    .error(function (data, status, headers, config) {
        $scope.fieldList = {};
    });	
	
	//Populate grid
	$http.get('http://localhost:8000/employees/query'	)
    .success(function (data, status, headers, config) {
		//Hide loading
		$("#loading").hide();
		$scope.employeeList = data;
		$("#maintable").show();
    })
    .error(function (data, status, headers, config) {
        $scope.employeeList = {};
    });	
	
	//25 employees per page (0 indexed)
	$scope.employeesPerPage = 99;
	$scope.currentPage = 0;
	
	$scope.range = function() {
		var rangeSize = 100;
		var ret = [];
		var start;

		start = $scope.currentPage;
		if ( start > $scope.pageCount()-rangeSize ) {
		start = $scope.pageCount()-rangeSize+1;
		}

		for (var i=start; i<start+rangeSize; i++) {
			ret.push(i);
		}
		return ret;
	};

	$scope.prevPage = function() {
		if ($scope.currentPage > 0) {
			$scope.currentPage--;
		}
	};

	$scope.prevPage = function() {
		if ($scope.currentPage > 0) {
		  $scope.currentPage--;
		}
	};

	$scope.prevPageDisabled = function() {
		return $scope.currentPage === 0 ? "disabled" : "";
	};

	$scope.pageCount = function() {
		return Math.ceil($scope.employeeList.length/$scope.employeesPerPage)-1;
	};

	$scope.nextPage = function() {
		if ($scope.currentPage < $scope.pageCount()) {
		  $scope.currentPage++;
		}
	};
	
	$scope.setPage = function(n) {
		$scope.currentPage = n;
	};

	$scope.nextPageDisabled = function() {
		return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
	};
});