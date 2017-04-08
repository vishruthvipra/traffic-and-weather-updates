/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("TrafficController", trafficController)
        function trafficController($routeParams, UserService, SensorService, ReadingService) {
            var vm = this;
            var userId = $routeParams["uid"];
            vm.getLocationReadings = getLocationReadings;
            vm.findReadingsForSensorId = findReadingsForSensorId;
            var latitude = "12.9716", longitude = "77.5946";
            vm.lati = latitude;
            vm.long = longitude;

            var markers = [];
            var map1, map2, infoWindow, trafficmap;
            var stopInit = true;

            function init() {
                var promise = UserService.findUserById(userId);
                promise.success(function (user) {
                    vm.user = user;
                    getLocationReadings();
                    stopInit = false;
                });

                initMap();
                findAllSensors();
            }
            init();

            function initMap() {
                trafficmap = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
                map1 = new google.maps.Map($(".gmaps")[0], {
                    zoom: 11,
                    center: trafficmap
                });
                map2 = new google.maps.Map($(".gmaps")[1], {
                    zoom: 11,
                    center: trafficmap
                });
            }

            function setMarker(map, location, title, content, sensorId) {
                latitude = parseFloat(location.latitude);
                longitude = parseFloat(location.longitude);

                var markerOptions = {
                    position: {lat: latitude, lng: longitude},
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

                    findReadingsForSensorId(sensorId);

                });

            }

            function findAllSensors() {
                var promise = SensorService.findAllSensorsForSensorType("TRAFFIC");
                promise.success(function (sensors) {
                    for (var i in sensors) {
                        setMarker(map1, sensors[i].location, sensors[i].area, sensors[i].area, sensors[i]._id);
                        setMarker(map2, sensors[i].location, sensors[i].area, sensors[i].area, sensors[i]._id);
                    }
                });
            }

            function findReadingsForSensorId(sensorId) {
                var data = [], noofcars = [], readno;
                var promise = SensorService.findSensorByIdWithSensorType(sensorId, "TRAFFIC");
                promise.success(function (sensors) {
                    for (var i in sensors.trafficReadings) {
                        var status = ReadingService.findReadingForId(sensors.trafficReadings[i], "TRAFFIC")
                            .success(function (reading) {
                                plotChart(data, noofcars, readno, reading);
                            })
                    }
                });
            }

            function plotChart(data, noofcars, readno, reading) {
                data.push(parseInt(reading.readno));
                noofcars.push(parseInt(reading.noofcars));
                readno = data.reverse();

                plotNoofcars(readno, noofcars, "carChart");
                plotNoofcars(readno, noofcars, "carCharts");
                vm.noofcars = noofcars[noofcars.length - 1];
            }

            function getLocationReadings() {
                if (stopInit) {
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
                        // if (err.code == 1) {
                        //     alert("Error: Access is denied!");
                        // }
                        // else if (err.code == 2) {
                        //     console.log("Error: Position is unavailable!");
                        // }
                    }

                    var data = [], noofcars = [], readno;
                    var promise = SensorService
                        .findSensorByCoordinatesWithSensorType(latitude, longitude, "TRAFFIC")
                        .success(function (sensor) {
                            for (var i in sensor.trafficReadings) {
                                var status = ReadingService.findReadingForId(sensor.trafficReadings[i], "TRAFFIC")
                                    .success(function (reading) {
                                        plotChart(data, noofcars, readno, reading);
                                    });
                            }
                        });
                }
            }

            function plotNoofcars(readno, noofcars, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno,
                        datasets: [{
                            label: 'Number of Cars',
                            data: noofcars,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255,99,132,1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'reading number'
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'in °C'
                                },
                                ticks: {
                                    max: 100,
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }
        }
})();