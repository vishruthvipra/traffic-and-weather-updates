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
            vm.search = false;

            vm.addUser = false, vm.changeUser = false;
            vm.createUser = createUser;
            vm.changedUser = changedUser;
            vm.updateUser = updateUser;
            vm.deleteUser = deleteUser;

            vm.addSensor = false, vm.changeSensor = false;
            vm.changedSensor = changedSensor;
            vm.createSensor = createSensor;
            vm.updateSensor = updateSensor;
            vm.deleteSensor = deleteSensor;

            vm.addReading = false, vm.changeReading = false;
            vm.changedReading = changedReading;
            vm.createReading = createReading;
            vm.updateReading = updateReading;
            vm.deleteReading = deleteReading;

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

            function changedUser(chgUser) {

                    vm.addUser = false;
                    if (vm.opUser === 1) {
                        updateUser(chgUser);
                    }
                    else {
                        deleteUser(chgUser);
                    }

            }

            function createUser(newUser) {
                if (user.role === "ADMIN" || user.role === "TADMIN" || user == null) {
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
                    vm.error = "Role cannot be Admin or TAdmin";
                }
            }

            function updateUser(updUser) {
                UserService
                    .findUserById(updUser._id)
                    .success(function (user) {
                        if (user.role === "ADMIN" || user.role === "TADMIN" || user == null) {
                            vm.error = "Cannot delete mentioned id";
                        }
                        else {
                            var update = UserService
                                .updateUser(updUser._id, updUser)
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
                    });

            }

            function deleteUser(delUser) {
                UserService
                    .findUserById(delUser._id)
                    .success(function (user) {
                        if (user.role === "ADMIN" || user.role === "TADMIN" || user == null) {
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
                    });
            }

            function changedSensor(chgSensor) {
                vm.addSensor = false;
                if (vm.opSensor === 1) {
                    updateSensor(chgSensor);
                }
                else {
                    deleteSensor(chgSensor);
                }
            }

            function createSensor(newSensor) {
                vm.changeSensor = false;
                newSensor.weatherReadings = newSensor.weatherReadings.split(/[\s,]+/);
                newSensor.sensorType = "WEATHER";
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

            function updateSensor(updSensor) {
                updSensor.weatherReadings = updSensor.weatherReadings.split(/[\s,]+/);
                updSensor.sensorType = "WEATHER";
                var update = SensorService
                    .updateSensor(updSensor._id, updSensor)
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
                            vm.error = "Could not delete user";
                        }
                    })
            }


            function changedReading(chgReading) {
                vm.addReading = false;
                if (vm.opReading === 1) {
                    updateReading(chgReading);
                }
                else {
                    deleteReading(chgReading);
                }
            }

            function createReading(newReading) {
                vm.changeReading = false;
                ReadingService
                    .createReading(newReading)
                    .success(function (sensor) {
                        vm.addReading = false;
                        ReadingService.findAllReadings("WEATHER")
                            .success(function (reading) {
                                vm.searchResults = reading;
                            });
                    });
            }

            function updateReading(updReading) {
                var update = ReadingService
                    .updateReading(updReading, "WEATHER")
                    .success(function (user) {
                        if(update != null)
                        {
                            vm.changeReading = false;
                            ReadingService.findAllReadings("WEATHER")
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
                    .findReadingForId(delReading._id, "WEATHER")
                    .success(function (reading) {
                        ReadingService
                            .deleteReading(reading)
                            .success(function (user) {
                                if(update != null)
                                {
                                    vm.changeReading = false;
                                    ReadingService.findAllReadings("WEATHER")
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

                    var promise = SensorService.findAllSensorsForSensorType("WEATHER");
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

                    var promise = ReadingService.findAllReadings("WEATHER");
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
                        var promise = SensorService.findSensorByIdWithSensorType(searchText, "WEATHER");
                        promise
                            .success(function (sensor) {
                                vm.searchResults = null;
                                vm.search = sensor;
                            });
                    }
                    else {
                        var coordinates = searchText.split(",");
                        var promise = SensorService.findSensorByCoordinatesWithSensorType(coordinates[0], coordinates[1], "WEATHER");
                        promise
                            .success(function (sensor) {
                                vm.searchResults = null;
                                vm.search = sensor;
                            });
                    }
                }
                else if(vm.r) {
                    var promise = ReadingService.findReadingForId(searchText, "WEATHER");
                    promise
                        .success(function (reading) {
                            vm.searchResults = null;
                            vm.search = reading;
                        });
                }
            }
        }
})();