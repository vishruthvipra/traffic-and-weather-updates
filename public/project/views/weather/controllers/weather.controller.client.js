/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("WeatherController", weatherController)
        function weatherController($routeParams, UserService, SensorService, ReadingService) {
            var vm = this;
            var userId = $routeParams["uid"];
            vm.getLocationReadings = getLocationReadings;
            vm.findReadingsForSensorId = findReadingsForSensorId;
            var latitude = "12.9716", longitude = "77.5946";
            vm.lati = latitude;
            vm.long = longitude;

            var markers = [];
            var map1, map2, infoWindow, weathermap;
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
                weathermap = {lat: parseFloat(latitude), lng: parseFloat(longitude)};
                map1 = new google.maps.Map($(".gmaps")[0], {
                    zoom: 11,
                    center: weathermap
                });
                map2 = new google.maps.Map($(".gmaps")[1], {
                    zoom: 11,
                    center: weathermap
                });
            }

            function setMarker(map, location, title, content, sensorId) {
                latitude = parseFloat(location.latitude);
                longitude = parseFloat(location.longitude);

                var markerOptions = {
                    position: {lat: latitude, lng: longitude},
                    map: map,
                    title: title
                    /*icon: new google.maps.MarkerImage("../../../images/green.png",
                        null,
                        null,
                        null,
                        new google.maps.Size(21, 34))*/
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

                    // console.log(sensorId);
                    findReadingsForSensorId(sensorId);

                });

            }

            function findAllSensors() {
                var promise = SensorService.findAllSensorsForSensorType("WEATHER");
                promise.success(function (sensors) {
                    for (var i in sensors) {
                        setMarker(map1, sensors[i].location, sensors[i].area, sensors[i].area, sensors[i]._id);
                        setMarker(map2, sensors[i].location, sensors[i].area, sensors[i].area, sensors[i]._id);
                    }

                });
            }

            function findReadingsForSensorId(sensorId) {
                var data = [], temperature = [], humidity = [], pressure = [], uvlevel = [], pm2 = [], pm5 = [], readno;
                var promise = SensorService.findSensorByIdWithSensorType(sensorId, "WEATHER");
                promise.success(function (sensors) {
                    for (var i in sensors.weatherReadings) {
                        var status = ReadingService.findReadingForId(sensors.weatherReadings[i], "WEATHER")
                            .success(function (reading) {
                                plotChart(data, temperature, humidity, pressure, uvlevel, pm2, pm5, readno, reading);
                            })
                    }
                });
            }

            function plotChart(data, temperature, humidity, pressure, uvlevel, pm2, pm5, readno, reading) {
                data.push(parseInt(reading.readno));
                temperature.push(parseInt(reading.temperature));
                humidity.push(parseInt(reading.humidity));
                pressure.push(parseInt(reading.pressure));
                uvlevel.push(parseInt(reading.uvlevel));
                pm2.push(parseInt(reading.pm2));
                pm5.push(parseInt(reading.pm5));

                readno = data.reverse();

                plotTemperature(readno, temperature, "tempChart");
                plotTemperature(readno, temperature, "tempCharts");
                plotHumidity(readno, humidity, "humdChart");
                plotHumidity(readno, humidity, "humdCharts");
                plotUVLevel(readno, uvlevel, "uvChart");
                plotUVLevel(readno, uvlevel, "uvCharts");
                plotPM(readno, pm2, pm5, "pmChart");
                plotPM(readno, pm2, pm5, "pmCharts");
                vm.temperature = temperature[temperature.length - 1];
                vm.humidity = humidity[humidity.length - 1];
                vm.pressure = pressure[pressure.length - 1];
                vm.uvlevel = uvlevel[uvlevel.length - 1];
                vm.pm2 = pm2[pm2.length - 1];
                vm.pm5 = pm5[pm5.length - 1];
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

                    var data = [], temperature = [], humidity = [], pressure = [], uvlevel = [], pm2 = [], pm5 = [], readno;
                    var promise = SensorService
                        .findSensorByCoordinatesWithSensorType(latitude, longitude, "WEATHER")
                        .success(function (sensor) {
                            console.log(sensor);
                            for (var i in sensor.weatherReadings) {
                                var status = ReadingService.findReadingForId(sensor.weatherReadings[i], "WEATHER")
                                    .success(function (reading) {
                                        plotChart(data, temperature, humidity, pressure, uvlevel, pm2, pm5, readno, reading);
                                    });
                            }
                        });
                }
            }

            function plotTemperature(readno, temperature, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'Temperature',
                            data: temperature,
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
                                    max: 50,
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotHumidity(readno, humidity, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'Humidity',
                            data: humidity,
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
                                    labelString: 'in %'
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

            function plotUVLevel(readno, uv, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'UV Level',
                            data: uv,
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
                                    labelString: 'in index'
                                },
                                ticks: {
                                    max: 20,
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotPM(readno, pm2, pm5, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'Particulate matter 2.5',
                            data: pm2,
                            backgroundColor: 'rgba(210, 180, 140, 0.2)',
                            borderColor: 'rgba(210, 180, 140, 1)',
                            borderWidth: 1
                        },
                            {
                                label: 'Particulate matter 5.0',
                                data: pm5,
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
                                    max: 5,
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }
        }
})();