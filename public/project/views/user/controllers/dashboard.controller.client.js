/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("DashboardController", dashboardController)
        function dashboardController(UserService, SensorService, $location, $rootScope, loggedin) {
            var vm = this;
            vm.user = loggedin.data;
            var user = vm.user;
            var userId = user._id;
            vm.logout = logout;
            var latitude = "12.9718", longitude = "77.6411";
            var markers = [];
            var map1, map2, infoWindow, weathermap;
            vm.ADMIN = false;
            vm.WADMIN = false;
            vm.TADMIN = false;

            function init() {
                if (user.role === "WADMIN") {
                    vm.WADMIN = true;
                    vm.TADMIN = false;
                    vm.ADMIN = false;
                }
                if (user.role === "TADMIN") {
                    vm.TADMIN = true;
                    vm.WADMIN = false;
                    vm.ADMIN = false;
                }
                if (user.role === "ADMIN") {
                    vm.WADMIN = false;
                    vm.TADMIN = false;
                    vm.ADMIN = true;
                }
                vm.hidden = true;


                $("#drop-down").hide();
                $("#gov-level-2").hide();
                $("#email-level-2").hide();
                $("#gov-level").hide();
                $("#email-level").hide();
                $("#navhide").hide();

                uiEvents();
                initMap();
                findAllSensors();
            }

            init();

            function uiEvents() {

                $("#domains").on('click',function() {
                    $("#gov-level-2").slideToggle("fast");
                });

                $("#emails").on('click',function() {
                    $("#email-level-2").slideToggle("fast");
                });

                $("#menu").on('click',function() {
                    $("#navhide").slideToggle("fast");
                });

                $("#domainnav").on('click',function() {
                    $("#gov-level").slideToggle("fast");
                });

                $("#emailnav").on('click',function() {
                    $("#email-level").slideToggle("fast");
                });
            }

            function initMap() {
                weathermap = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
                map1 = new google.maps.Map($("#gmaps")[0], {
                    zoom: 11,
                    center: weathermap
                });

                map2 = new google.maps.Map($("#gmap")[0], {
                    zoom: 11,
                    center: weathermap
                });

                google.maps.event.addDomListenerOnce(map1, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        map1.setCenter(weathermap);
                    });
                });

                google.maps.event.addDomListenerOnce(map2, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        map2.setCenter(weathermap);
                    });
                });
            }

            function setMarker(map, location, title, content) {
                latitude = parseFloat(location.latitude);
                longitude = parseFloat(location.longitude);
                if (content === "WEATHER") {
                    var markerOptions = {
                        position: {lat: latitude, lng: longitude},
                        map: map,
                        title: title,
                        icon: new google.maps.MarkerImage("../../../images/green.png",
                            null,
                            null,
                            null,
                            new google.maps.Size(21, 34))
                    };
                }
                else {
                    var markerOptions = {
                        position: {lat: latitude, lng: longitude},
                        map: map,
                        title: title
                    };
                }


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

            function findAllSensors() {
                var promise = SensorService.findAllSensors();
                promise.success(function (sensors) {
                    for (var i in sensors) {
                        setMarker(map1, sensors[i].location, sensors[i].area, sensors[i].sensorType);
                        setMarker(map2, sensors[i].location, sensors[i].area, sensors[i].sensorType);
                    }

                });
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
