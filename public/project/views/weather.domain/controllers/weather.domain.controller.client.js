/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("weatherDomainController", weatherDomainController)
        function weatherDomainController($routeParams, UserService, SensorService, ReadingService) {
            var vm = this;
            var userId = $routeParams["uid"];
            vm.u = false, vm.s = false, vm.r = false;
            vm.modelClicked = modelClicked;
            vm.startSearch = startSearch;


            function init() {
                var promise = UserService.findUserById(userId);
                promise.success(function (user) {
                    vm.user = user;
                    vm.hidden = true;
                });
            }

            init();

            function modelClicked(num) {
                if (num === 0) {
                    vm.s = false;
                    vm.r = false;
                    vm.u = true;

                    var promise = UserService.findAllUsers();
                    promise
                        .success(function (user) {
                            vm.searchResults = user;
                        });
                }

                else if (num === 1) {
                    vm.r = false;
                    vm.u = false;
                    vm.s = true;

                    var promise = SensorService.findAllSensors();
                    promise
                        .success(function (sensor) {
                            vm.searchResults = sensor;
                        });
                }
                else {
                    vm.s = false;
                    vm.u = false;
                    vm.r = true;

                    var promise = ReadingService.findAllUsers();
                    promise
                        .success(function (reading) {
                            vm.searchResults = reading;
                        });
                }
            }

            function startSearch(searchValue, searchText) {
                if(vm.u) {
                    if (searchValue === 1) {
                        var promise = UserService.findUserById(searchText);
                        promise
                            .success(function (user) {
                                vm.searchResults = null;
                                vm.search = user;
                            });
                    }
                    else {
                        var promise = UserService.findUserByUsername(searchText);
                        promise
                            .success(function (user) {
                                vm.searchResults = null;
                                vm.search = user;
                            });
                    }
                }
                else if(vm.s) {
                    if (searchValue === 1) {
                        var promise = SensorService.findSensorById(searchText);
                        promise
                            .success(function (sensor) {
                                vm.searchResults = null;
                                vm.search = sensor;
                            });
                    }
                    else {
                        var coordinates = searchText.split(",");
                        var promise = SensorService.findSensorByCoordinates(coordinates[0], coordinates[1]);
                        promise
                            .success(function (sensor) {
                                vm.searchResults = null;
                                vm.search = sensor;
                            });
                    }
                }
            }
        }
})();