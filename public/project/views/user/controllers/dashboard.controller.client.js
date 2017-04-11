/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("DashboardController", dashboardController)
        function dashboardController($routeParams, UserService, SensorService, $location, $rootScope) {
            var vm = this;
            var userId = $routeParams["uid"];
            vm.logout = logout;
            var latitude = "12.9718", longitude = "77.6411";
            var markers = [];
            var map1, infoWindow, weathermap;

            function init() {
                var promise = UserService.findUserById(userId);
                promise.success(function (user) {
                    vm.user = user;
                    vm.hidden = true;
                });

                $("#drop-down").hide();
                $("#gov-level-2").hide();
                $("#email-level-2").hide();
                $("#ticketing-level-2").hide();
                $("#ticketing-level-3").hide();
                $("#traffic-level-2").hide();

                uiEvents();
                initMap();
                findAllSensors();
            }

            init();

            function uiEvents() {

                // $(document).on('click','#domains',function(){
                //     $("#gov-level-2").slideToggle("fast");
                // });

                $("#domains").on('click',function() {
                    $("#gov-level-2").slideToggle("fast");
                });

                $("#email").on('click',function() {
                    $("#email-level-2").slideToggle("fast");
                });

                $("#ticketing").on('click',function() {
                    $("#ticketing-level-2").slideToggle("fast");
                });

                $("#third-level").on('click',function() {
                    $("#ticketing-level-3").slideToggle("fast");
                });

                $("#traffic-drop-down").on('click',function() {
                    $("#traffic-level-2").slideToggle("fast");
                });
            }

            function initMap() {
                weathermap = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
                map1 = new google.maps.Map($("#gmaps")[0], {
                    zoom: 11,
                    center: weathermap
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
