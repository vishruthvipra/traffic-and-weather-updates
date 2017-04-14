/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("trafficDomainController", trafficDomainController)
    function trafficDomainController($rootScope, UserService, SensorService, ReadingService, loggedin, $location) {
        var vm = this;
        vm.user = loggedin.data;
        var user = vm.user;
        var userId = user._id;
        vm.u = false, vm.s = false, vm.r = false;
        vm.search = false;
        vm.editfields = false;

        vm.addUser = false;
        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;

        vm.addSensor = false, vm.changeSensor = false;
        vm.createSensor = createSensor;
        vm.updateSensor = updateSensor;
        vm.deleteSensor = deleteSensor;

        vm.addReading = false, vm.changeReading = false;
        vm.createReading = createReading;
        vm.updateReading = updateReading;
        vm.deleteReading = deleteReading;

        vm.modelClicked = modelClicked;
        vm.startSearch = startSearch;
        vm.logout = logout;

        function init() {
            vm.user = user;
            vm.hidden = true;
        }

        init();

        function createUser(newUser) {
            if (user.role === "ADMIN" || user.role === "WADMIN" || user == null) {
                vm.changeUser = false;
                UserService
                    .findUserByUsername(newUser.username)
                    .success(function (user) {
                        vm.error = "User already exists";
                    })
                    .error(function (err) {
                        UserService
                            .register(newUser)
                            .success(function (user) {
                                vm.add = false;
                                UserService.findAllUsers()
                                    .success(function (user) {
                                        vm.searchResults = user;
                                    });
                            })
                    });
            }
            else {
                vm.error = "Role cannot be Admin or WAdmin";
            }
        }

        function updateUser(oldUserId, updUser) {
            vm.editfields = false;
            UserService
                .findUserById(oldUserId)
                .success(function (user) {
                    if (user.role === "ADMIN" || user.role === "WADMIN" || user == null) {
                        vm.error = "Cannot delete mentioned id";
                    }
                    else {
                        var update = UserService
                            .updateUser(oldUserId, updUser)
                            .success(function (user) {
                                if (update != null) {
                                    vm.changeUser = false;
                                    UserService.findAllUsers()
                                        .success(function (user) {
                                            vm.searchResults = user;
                                        });
                                }
                                else {
                                    vm.error = "Unable to update..."
                                }
                            });
                    }
                }).error(function (err) {
                vm.error = "Unable to update...";
            });
        }

        function deleteUser(delUser) {
            UserService
                .findUserById(delUser._id)
                .success(function (user) {
                    if (user.role === "ADMIN" || user.role === "WADMIN" || user == null) {
                        vm.error = "Cannot delete mentioned id";
                    }
                    else {
                        var update = UserService
                            .deleteUser(delUser._id)
                            .success(function (user) {
                                if (user != null) {
                                    vm.changeUser = false;
                                    UserService.findAllUsers()
                                        .success(function (user) {
                                            vm.searchResults = user;
                                        });
                                }
                                else {
                                    vm.error = "Could not delete user";
                                }
                            })
                    }
                }).error(function (err) {
                vm.error = "Unable to update...";
            });
        }

        function createSensor(newSensor) {
            vm.changeSensor = false;
            if(newSensor.trafficReadings) {
                newSensor.trafficReadings = newSensor.trafficReadings.split(/[\s,]+/);
            }
            newSensor.sensorType = "TRAFFIC";
            SensorService
                .createSensor(newSensor)
                .success(function (sensor) {
                    vm.addSensor = false;
                    SensorService.findAllSensors()
                        .success(function (sensor) {
                            vm.searchResults = sensor;
                        });
                });
        }

        function updateSensor(oldSensorId, updSensor) {
            vm.editfields = false;
            if(updSensor.trafficReadings) {
                updSensor.trafficReadings = updSensor.trafficReadings.split(/[\s,]+/);
            }
            updSensor.sensorType = "TRAFFIC";
            var update = SensorService
                .updateSensor(oldSensorId, updSensor)
                .success(function (sensor) {
                    if(update != null)
                    {
                        vm.changeSensor = false;
                        SensorService.findAllSensors()
                            .success(function (sensor) {
                                vm.searchResults = sensor;
                            });
                    }
                    else {
                        vm.error = "Unable to update..."
                    }
                });
        }

        function deleteSensor(delSensor) {
            var update = SensorService
                .deleteSensor(delSensor._id)
                .success(function (sensor) {
                    if (sensor != null) {
                        vm.changeSensor = false;
                        SensorService.findAllSensors()
                            .success(function (sensor) {
                                vm.searchResults = sensor;
                            });
                    }
                    else {
                        vm.error = "Could not delete sensor";
                    }
                })
        }

        function createReading(newReading) {
            vm.changeReading = false;
            ReadingService
                .createReading(newReading)
                .success(function (sensor) {
                    vm.addReading = false;
                    ReadingService.findAllReadings("TRAFFIC")
                        .success(function (reading) {
                            vm.searchResults = reading;
                        });
                });
        }

        function updateReading(oldReadingId, updReading) {
            vm.editfields = false;
            var update = ReadingService
                .updateReading(oldReadingId, updReading, "TRAFFIC")
                .success(function (user) {
                    if(update != null)
                    {
                        vm.changeReading = false;
                        ReadingService.findAllReadings("TRAFFIC")
                            .success(function (reading) {
                                vm.searchResults = reading;
                            });
                    }
                    else {
                        vm.error = "Unable to update..."
                    }
                });
        }

        function deleteReading(delReading) {
            var update = ReadingService
                .findReadingForId(delReading._id, "TRAFFIC")
                .success(function (reading) {
                    ReadingService
                        .deleteReading(reading)
                        .success(function (user) {
                            if(update != null)
                            {
                                vm.changeReading = false;
                                ReadingService.findAllReadings("TRAFFIC")
                                    .success(function (reading) {
                                        vm.searchResults = reading;
                                    });
                            }
                            else {
                                vm.error = "Could not delete reading";
                            }
                        });
                });

        }


        function modelClicked(num) {
            vm.search = false;
            if (num === 0) {
                vm.addUser = false;
                vm.changeUser = false;
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
                vm.addSensor = false;
                vm.changeSensor = false;
                vm.r = false;
                vm.u = false;
                vm.s = true;

                var promise = SensorService.findAllSensorsForSensorType("TRAFFIC");
                promise
                    .success(function (sensor) {
                        vm.searchResults = sensor;
                    });
            }
            else {
                vm.addReading = false;
                vm.changeReading = false;
                vm.s = false;
                vm.u = false;
                vm.r = true;

                var promise = ReadingService.findAllReadings("TRAFFIC");
                promise
                    .success(function (reading) {
                        vm.searchResults = reading;
                    });
            }
        }

        function startSearch(searchValue, searchText) {
            vm.search = true;
            vm.searchResults = false;
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
                    var promise = SensorService.findSensorByIdWithSensorType(searchText, "TRAFFIC");
                    promise
                        .success(function (sensor) {
                            vm.searchResults = null;
                            vm.search = sensor;
                        });
                }
                else {
                    var coordinates = searchText.split(",");
                    var promise = SensorService.findSensorByCoordinatesWithSensorType(coordinates[0], coordinates[1], "TRAFFIC");
                    promise
                        .success(function (sensor) {
                            vm.searchResults = null;
                            vm.search = sensor;
                        });
                }
            }
            else if(vm.r) {
                var promise = ReadingService.findReadingForId(searchText, "TRAFFIC");
                promise
                    .success(function (reading) {
                        vm.searchResults = null;
                        vm.search = reading;
                    });
            }
        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $rootScope.currentUser = null;
                    $location.url("/home");
                });
        }
    }
})();