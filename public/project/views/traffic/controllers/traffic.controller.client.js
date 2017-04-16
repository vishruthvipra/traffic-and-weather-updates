/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("TrafficController", trafficController)
        function trafficController($location, UserService, SensorService, ReadingService, loggedin, $rootScope) {
            var vm = this;
            vm.user = loggedin.data;
            var user = vm.user;
            var userId = user._id;
            vm.getLocationReadings = getLocationReadings;
            vm.logout = logout;

            // Heart of Bangalore readings if user denies sharing his location
            var latitude = "12.9716", longitude = "77.5946";
            vm.lati = latitude;
            vm.long = longitude;

            var markers = [];
            var map1, map2, infoWindow, trafficmap;

            function init() {
                getLocationReadings();
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

                google.maps.event.addDomListenerOnce(map1, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        map1.setCenter(trafficmap);
                    });
                });

                google.maps.event.addDomListenerOnce(map2, 'idle', function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        map2.setCenter(trafficmap);
                    });
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

                    $(".fa-pulse").show();
                    SensorService
                        .populateReadingsById(sensorId, "TRAFFIC")
                        .success(function (readings) {
                            dataForCharts(readings);
                        });
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

            function dataForCharts(readings) {
                var data = [], noofcars = [], colevel = [], solevel = [], nolevel = [], readno;
                for (var i in readings) {
                    data.push(parseInt(readings[i].readno));
                    noofcars.push(parseInt(readings[i].noofcars));
                    colevel.push(parseInt(readings[i].colevel));
                    solevel.push(parseInt(readings[i].solevel));
                    nolevel.push(parseInt(readings[i].nolevel));
                }
                readno = data.reverse();
                vm.noofcars = noofcars[noofcars.length - 1];
                vm.colevel = colevel[colevel.length - 1];
                vm.solevel = solevel[solevel.length - 1];
                vm.nolevel = nolevel[nolevel.length - 1];
                plotChart(noofcars, colevel, solevel, nolevel, readno);
            }

            function getLocationReadings() {
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
                    $(".fa-pulse").show();
                    SensorService
                        .populateReadings(latitude, longitude, "TRAFFIC")
                        .success(function (readings) {
                            dataForCharts(readings);
                        });
                }

                function errorHandler(err) {
                }

                SensorService
                    .populateReadings(latitude, longitude, "TRAFFIC")
                    .success(function (readings) {
                        dataForCharts(readings);
                    });
            }

            function plotChart(noofcars, colevel, solevel, nolevel, readno) {
                plotNoofcars(readno, noofcars, "carChart");
                plotNoofcars(readno, noofcars, "carCharts");
                plotCoLevel(readno, colevel, "coChart");
                plotCoLevel(readno, colevel, "coCharts");
                plotSoLevel(readno, solevel, "soChart");
                plotSoLevel(readno, solevel, "soCharts");
                plotNoLevel(readno, nolevel, "noChart");
                plotNoLevel(readno, nolevel, "noCharts");
                $(".fa-pulse").hide();
            }

            function plotNoofcars(readno, noofcars, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
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
                                    labelString: 'in units'
                                },
                                ticks: {
                                    max: Math.max.apply(Math, noofcars),
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotCoLevel(readno, colevel, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'Carbon Dioxide Level',
                            data: colevel,
                            backgroundColor: 'rgba(204, 204, 0, 0.2)',
                            borderColor: 'rgba(204, 204, 0, 1)',
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
                                    labelString: 'in ppm'
                                },
                                ticks: {
                                    max: Math.max.apply(Math, colevel),
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotSoLevel(readno, solevel, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'Suplhur Dioxide Level',
                            data: solevel,
                            backgroundColor: 'rgba(135, 206, 235, 0.2)',
                            borderColor: 'rgba(135, 206, 235, 1)',
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
                                    labelString: 'in ppm'
                                },
                                ticks: {
                                    max: Math.max.apply(Math, solevel),
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotNoLevel(readno, nolevel, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'Nitrous Oxide Level',
                            data: nolevel,
                            backgroundColor: 'rgba(160, 82 ,45, 0.2)',
                            borderColor: 'rgba(160, 82 ,45, 1)',
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
                                    labelString: 'in ppm'
                                },
                                ticks: {
                                    max: Math.max.apply(Math, nolevel),
                                    beginAtZero:true
                                }
                            }]
                        }
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