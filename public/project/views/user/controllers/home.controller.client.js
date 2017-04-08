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
            //12.9718	77.6411 12.9722	77.6011
            var latitude = "12.9718", longitude = "77.6411";
            var markers = [];
            var map1, map2, infoWindow, weathermap, trafficmap;
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

            function getLocationCoordinates(mapType) {
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

                    if (mapType === "WEATHER")
                        initWeatherMap();
                    else if (mapType === "TRAFFIC")
                        initTrafficMap();
                    else {
                        initWeatherMap();
                        initTrafficMap();
                    }
                }

                function errorHandler(err) {
                    // if (err.code == 1) {
                    //     alert("Error: Access is denied!");
                    // }
                    // else if (err.code == 2) {
                    //     console.log("Error: Position is unavailable!");
                    // }
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
                        }
                        else if (sensorType === "TRAFFIC" && reading.noofcars != "")
                            vm.noofcars = reading.noofcars;
                        else {
                            vm.error = "Incorrect credentials entered";
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

            function setMarker(map, position, title, content) {
                var markerOptions = {
                    position: position,
                    map: map,
                    title: title
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
                        content: content
                    };
                    infoWindow = new google.maps.InfoWindow(infoWindowOptions);
                    infoWindow.open(map, marker);
                });

            }

            setMarker(map1, weathermap, 'Bangalore', 'some content');
            setMarker(map2, trafficmap, 'SahaNAga', 'some content');


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
            }
        }

})();
