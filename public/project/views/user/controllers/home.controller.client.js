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
            var map1, map2, map3, map4, weathermap, trafficmap, infoWindow;

            function init() {
                $("#drop-down").hide();
                uiEvents();
                getLocationReadings("WEATHER");
                getLocationReadings("TRAFFIC");
                getLocationCoordinates();
                initWeatherMap();
                initTrafficMap();
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

            function getLocationCoordinates() {
                if (navigator.geolocation) {
                    var options = {timeout: 60000};
                    navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
                }

                function showLocation(position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    latitude = lat.toString();
                    longitude = long.toString();

                    initWeatherMap();
                    initTrafficMap();

                    getLocationReadings("WEATHER");
                    getLocationReadings("TRAFFIC");
                }

                function errorHandler(err) {
                    // left intentionally
                }

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
                weathermap = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
                map1 = new google.maps.Map($(".gmaps")[0], {
                    zoom: 13,
                    center: weathermap
                });

                map3 = new google.maps.Map($(".gmaps")[1], {
                    zoom: 13,
                    center: weathermap
                });


                google.maps.event.addDomListenerOnce(map1, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        map1.setCenter(weathermap);
                    });
                });

                google.maps.event.addDomListenerOnce(map3, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        map3.setCenter(weathermap);
                    });
                });

                setMarker(map1, weathermap);
                setMarker(map3, weathermap);
            }

            function initTrafficMap() {
                trafficmap = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
                map2 = new google.maps.Map($(".gmaps")[2], {
                    zoom: 13,
                    center: trafficmap
                });

                map4 = new google.maps.Map($(".gmaps")[3], {
                    zoom: 13,
                    center: trafficmap
                });


                google.maps.event.addDomListenerOnce(map2, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        map2.setCenter(trafficmap);
                    });
                });

                google.maps.event.addDomListenerOnce(map4, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        map4.setCenter(trafficmap);
                    });
                });

                setMarker(map2, trafficmap);
                setMarker(map4, trafficmap);
            }

            function setMarker(map, position) {
                var markerOptions = {
                    position: position,
                    map: map,
                    title: "Your location"
                };

                var marker = new google.maps.Marker(markerOptions);
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function () {
                    // close window if not undefined
                    if (infoWindow !== void 0) {
                        infoWindow.close();
                    }
                    // create new window
                    var infoWindowOptions = {
                        content: "Your location"
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });
            }

            setMarker(map1, weathermap);
            setMarker(map3, weathermap);
            setMarker(map2, trafficmap);
            setMarker(map4, trafficmap);


            function login(user) {
                UserService
                    .login(user)
                    .success(function (user) {
                        $rootScope.currentUser = user;
                        $location.url("/dashboard");
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
                                    $location.url("/profile");
                                });
                        });
                }
            }
        }

})();
