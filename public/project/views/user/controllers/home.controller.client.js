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

            var latitude = "12.9718", longitude = "77.6411";
            var markers = [];
            var map1, map2, weathermap, trafficmap;
            var stopInit = true;

            function init() {
                $("#drop-down").hide();
                uiEvents();
                getLocationCoordinates("init");
                initWeatherMap();
                initTrafficMap();
                stopInit = false;
            }

            init();

            function uiEvents() {
                $(".traffic-label").on('click', function () {
                    $('html, body').animate({
                        'scrollTop': $("#traffic").position().top
                    });
                });

                $(".weather-label").on('click', function () {
                    $('html, body').animate({
                        'scrollTop': $("#weather").position().top
                    });
                });

                $(".contact-label").on('click', function () {
                    $('html, body').animate({
                        'scrollTop': $("#contact").position().top
                    });
                });

                $('.loginform').click(function () {

                    $('.login').fadeToggle('slow');
                    $('#main-container').addClass('blur-background');
                });

                $('form').click(function () {
                    $('#main-container').addClass('blur-background');
                });

                // To make register form appear and blur the background
                $('.registerform').click(function () {
                    $('.register').fadeToggle('slow');
                    $('#main-container').addClass('blur-background');
                });

                $(document).mouseup(function (e) {
                    var container = $(".login");
                    if (!container.is(e.target) && container.has(e.target).length === 0) {
                        container.hide();
                    }
                });

                $(document).mouseup(function (e) {
                    var container = $(".register");
                    if (!container.is(e.target) && container.has(e.target).length === 0) {
                        container.hide();
                        $('#main-container').removeClass('blur-background');
                    }
                });

                $(".arrow-down").on('click', function () {
                    $("#drop-down").toggle("fast");
                });
            }

            function getLocationCoordinates(mapType) {
                if (navigator.geolocation) {
                    var options = {timeout: 60000};
                    navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
                }
                else {
                    vm.error2 = "Sorry, browser does not support geolocation!";
                }

                function showLocation(position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    latitude = lat.toString();
                    longitude = long.toString();

                    if (mapType === "WEATHER")
                        initWeatherMap();
                    if (mapType === "TRAFFIC")
                        initTrafficMap();
                    else {
                        initWeatherMap();
                        initTrafficMap();
                    }
                }

                function errorHandler(err) {
                    if (err.code == 1) {
                        vm.error2 = "Error: Access is denied!";
                    }
                    else if (err.code == 2) {
                        vm.error2 = "Error: Position is unavailable!";
                    }
                }

                getLocationReadings("WEATHER");
                getLocationReadings("TRAFFIC");
            }

            function getLocationReadings(sensorType) {
                var promise = ReadingService
                    .findReadingsForCoordinates(latitude, longitude, sensorType)
                    .success(function (reading) {
                        if (sensorType === "WEATHER" && reading.temperature != "") {
                            vm.temperature = reading.temperature;
                            vm.humidity = reading.humidity;
                            vm.pressure = reading.pressure;
                            vm.waterlevel = reading.waterlevel;
                            vm.uvlevel = reading.uvlevel;
                            vm.pm2 = reading.pm2;
                            vm.pm5 = reading.pm5;
                            vm.error = false;
                        }
                        if (sensorType === "TRAFFIC" && reading.noofcars != "") {
                            vm.noofcars = reading.noofcars;
                            vm.colevel = reading.colevel;
                            vm.solevel = reading.solevel;
                            vm.nolevel = reading.nolevel;
                            vm.error = false;
                        }
                    });
            }

            function initWeatherMap() {
                if (stopInit) {
                    weathermap = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
                    map1 = new google.maps.Map($(".gmaps")[0], {
                        zoom: 13,
                        center: weathermap
                    });
                }
            }

            function initTrafficMap() {
                if (stopInit) {
                    trafficmap = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
                    map2 = new google.maps.Map($(".gmaps")[1], {
                        zoom: 13,
                        center: trafficmap
                    });
                }
            }

            function setMarker(map, position) {
                var markerOptions = {
                    position: position,
                    map: map,
                    title: "Your nearest location"
                };

                var marker = new google.maps.Marker(markerOptions);
                markers.push(marker);
            }

            setMarker(map1, weathermap);
            setMarker(map2, trafficmap);


            function login(user) {
                UserService
                    .login(user)
                    .success(function (user) {
                        $rootScope.currentUser = user;
                        $location.url("user/" + user._id)
                    })
                    .error(function (err) {
                        vm.error = "Username/password does not match";
                    });
            }

            function register(user) {
                if(!(user.firstName && user.lastName && user.username)) {
                    vm.error3 = "Please fill all the fields below";
                }
                else if (user.vpassword !== user.password) {
                    vm.error3 = "Passwords do not match";
                }
                else {
                    user.role = "NORMAL";
                    UserService
                        .findUserByUsername(user.username)
                        .success(function (user) {
                            vm.error3 = "Username already exists";
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
                }
            }
        }

})();
