/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("HomeController", HomeController);
        function HomeController(UserService, ReadingService, $location) {
            var vm = this;
            vm.login = login;
            vm.register = register;
            vm.getLocationReadings = getLocationReadings;
            var latitude = "12.9716", longitude = "77.5946";

            function init() {
                getLocationReadings();
            }
            init();


            function getLocationReadings() {
                if(navigator.geolocation){
                    var options = {timeout:60000};
                    navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
                }
                else{
                    alert("Sorry, browser does not support geolocation!");
                }

                function showLocation(position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    latitude = lat.toString();
                    longitude = long.toString();
                }

                function errorHandler(err) {
                    // if(err.code == 1) {
                    //     alert("Error: Access is denied!");
                    // }
                    // else if( err.code == 2) {
                    //     console.log("Error: Position is unavailable!");
                    // }
                }

                var promise = ReadingService
                    .getReadings(latitude, longitude)
                    .success(function (reading) {
                        if (reading.temperature != "") {
                            vm.temperature = reading.temperature;
                            vm.humidity = reading.humidity;
                            vm.pressure = reading.pressure;
                        }
                        else {
                            vm.error = "Incorrect credentials entered";
                        }
                    });
            }

            function login(user) {
                var promise = UserService
                    .findUserByCredentials(user.username, user.password)
                    .success(function (user) {
                        if (user != "") {
                            $location.url("user/" + user._id);
                        }
                        else {
                            vm.error = "Incorrect credentials entered";
                        }
                    });

            }

            function register(user) {
                var newUser = UserService
                    .findUserByUsername(user.username)
                    .success(function (user) {
                        vm.error = "User already exists"; })
                    .error(function (err) {
                        UserService
                            .createUser(user)
                            .success(function (user) {
                                $location.url("user/" + user._id + "/profile");
                            })
                    });
            }
        }

})();
