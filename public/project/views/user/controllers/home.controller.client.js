/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("HomeController", HomeController);
        function HomeController(UserService, ReadingService, $location, $rootScope) {
            var vm = this;
            vm.login = login;
            vm.register = register;
            vm.getLocationCoordinates = getLocationCoordinates;
            vm.getLocationReadings = getLocationReadings;
            var latitude = "12.9716", longitude = "77.5946";

            function init() {
                $("#drop-down").hide();
                uiEvents();
                getLocationCoordinates();
            }
            init();

            function uiEvents() {
                $(".traffic-label").on('click',function() {
                    $('html, body').animate({
                        'scrollTop' : $("#traffic").position().top
                    });
                });

                $(".weather-label").on('click',function() {
                    $('html, body').animate({
                        'scrollTop' : $("#weather").position().top
                    });
                });

                $(".contact-label").on('click',function() {
                    $('html, body').animate({
                        'scrollTop' : $("#contact").position().top
                    });
                });

                $('.loginform').click(function () {

                    $('.login').fadeToggle('slow');
                    $('#main-container').addClass('blur-background');
                });

                $('fieldset').click(function () {
                    $('#main-container').addClass('blur-background');
                });

                // To make register form appear and blur the background
                $('.registerform').click(function () {
                    $('.register').fadeToggle('slow');
                    $('#main-container').addClass('blur-background');
                });

                $(document).mouseup(function (e) {
                    var container = $(".login");
                    if (!container.is(e.target) && container.has(e.target).length == 0) {
                        container.hide();
                    }
                });

                $(document).mouseup(function (e) {
                    var container = $(".register");
                    if (!container.is(e.target) && container.has(e.target).length == 0) {
                        container.hide();
                        $('#main-container').removeClass('blur-background');
                    }
                });

                $(".arrow-down").on('click',function() {
                    $("#drop-down").toggle("fast");
                });
            }

            function getLocationCoordinates() {
                if (navigator.geolocation) {
                    var options = {timeout: 60000};
                    navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
                }
                else {
                    alert("Sorry, browser does not support geolocation!");
                }

                function showLocation(position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    latitude = lat.toString();
                    longitude = long.toString();
                }

                function errorHandler(err) {
                    if (err.code == 1) {
                        alert("Error: Access is denied!");
                    }
                    else if (err.code == 2) {
                        console.log("Error: Position is unavailable!");
                    }
                }

                getLocationReadings();
            }

            function getLocationReadings() {
                var promise = ReadingService
                    .findReadingsForCoordinates(latitude, longitude)
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
                UserService
                    .login(user)
                    .then(function(response) {
                        var user = response.data;
                        $rootScope.currentUser = user;
                        $location.url("user/" + user._id);
                    },function (err) {
                        vm.error = "Username/password does not match";
                    });


                // var promise = UserService
                //     .findUserByCredentials(user.username, user.password)
                //     .success(function (user) {
                //         if (user != "") {
                //             $location.url("user/" + user._id);
                //         }
                //         else {
                //             vm.error = "Incorrect credentials entered";
                //         }
                //     });

            }

            function register(user) {
                UserService
                    .findUserByUsername(user.username)
                    .success(function (user) {
                        vm.error = "User already exists";
                    })
                    .error(function (err) {
                        UserService
                            .register(user)
                            .then(function (response) {
                                var user = response.data;
                                $rootScope.currentUser = user;
                                $location.url("user/" + user._id + "/profile");
                            });
                    });


                // var newUser = UserService
                //     .findUserByUsername(user.username)
                //     .success(function (user) {
                //         vm.error = "User already exists"; })
                //     .error(function (err) {
                //         UserService
                //             .createUser(user)
                //             .success(function (user) {
                //                 $location.url("user/" + user._id + "/profile");
                //             })
                //     });
            }
        }

})();
