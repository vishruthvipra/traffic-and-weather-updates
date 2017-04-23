/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("WeatherController", weatherController)
        function weatherController($location, UserService, SensorService, loggedin) {
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
            var map1, map2, infoWindow, weathermap;

            function init() {
                getLocationReadings();
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

                    SensorService
                        .populateReadingsById(sensorId, "WEATHER")
                        .success(function (readings) {
                            dataForCharts(readings);
                        });
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

            function dataForCharts(readings) {
                var data = [], temperature = [], humidity = [], pressure = [];
                var waterlevel =[], uvlevel = [], pm2 = [], pm5 = [], readno;

                for (var i in readings) {
                    data.push(parseInt(readings[i].readno));
                    temperature.push(parseInt(readings[i].temperature));
                    humidity.push(parseInt(readings[i].humidity));
                    pressure.push(parseInt(readings[i].pressure));
                    waterlevel.push(parseInt(readings[i].waterlevel));
                    uvlevel.push(parseInt(readings[i].uvlevel));
                    pm2.push(parseInt(readings[i].pm2));
                    pm5.push(parseInt(readings[i].pm5));
                }
                readno = data.reverse();
                vm.temperature = temperature[temperature.length - 1];
                vm.humidity = humidity[humidity.length - 1];
                vm.pressure = pressure[pressure.length - 1];
                vm.waterlevel = waterlevel[waterlevel.length - 1];
                vm.uvlevel = uvlevel[uvlevel.length - 1];
                vm.pm2 = pm2[pm2.length - 1];
                vm.pm5 = pm5[pm5.length - 1];
                plotChart(temperature, humidity, pressure, waterlevel, uvlevel, pm2, pm5, readno);
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
                        .populateReadings(latitude, longitude, "WEATHER")
                        .success(function (readings) {
                            dataForCharts(readings);
                        });
                }

                function errorHandler(err) {
                }

                $(".fa-pulse").show();
                SensorService
                    .populateReadings(latitude, longitude, "WEATHER")
                    .success(function (readings) {
                        dataForCharts(readings);
                    });

            }

            function plotChart(temperature, humidity, pressure, waterlevel, uvlevel, pm2, pm5, readno) {
                plotTemperature(readno, temperature, "tempChart");
                plotTemperature(readno, temperature, "tempCharts");
                plotPressure(readno, pressure, "pressChart");
                plotPressure(readno, pressure, "pressCharts");
                plotWaterLevel(readno, waterlevel, "waterChart");
                plotWaterLevel(readno, waterlevel, "waterCharts");
                plotHumidity(readno, humidity, "humdChart");
                plotHumidity(readno, humidity, "humdCharts");
                plotUVLevel(readno, uvlevel, "uvChart");
                plotUVLevel(readno, uvlevel, "uvCharts");
                plotPM(readno, pm2, pm5, "pmChart");
                plotPM(readno, pm2, pm5, "pmCharts");
                $(".fa-pulse").hide();
            }

            function plotTemperature(readno, temperature, id) {
                var chart1 = document.getElementById(id);
                if(vm[id]) {
                    vm[id].destroy();
                }
                vm[id] = new Chart(chart1, {
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
                                    max: Math.max.apply(Math, temperature),
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotPressure(readno, pressure, id) {
                var chart1 = document.getElementById(id);
                if(vm[id]) {
                    vm[id].destroy();
                }
                vm[id] = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'Pressure',
                            data: pressure,
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
                                    labelString: 'in kPa'
                                },
                                ticks: {
                                    max: Math.max.apply(Math, pressure),
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotWaterLevel(readno, waterlevel, id) {
                var chart1 = document.getElementById(id);
                if(vm[id]) {
                    vm[id].destroy();
                }
                vm[id] = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno.sort(),
                        datasets: [{
                            label: 'Water Level',
                            data: waterlevel,
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
                                    labelString: 'in cm'
                                },
                                ticks: {
                                    max: Math.max.apply(Math, waterlevel),
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotHumidity(readno, humidity, id) {
                var chart1 = document.getElementById(id);
                if(vm[id]) {
                    vm[id].destroy();
                }
                vm[id] = new Chart(chart1, {
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
                                    max: Math.max.apply(Math, humidity),
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotUVLevel(readno, uv, id) {
                var chart1 = document.getElementById(id);
                if(vm[id]) {
                    vm[id].destroy();
                }
                vm[id] = new Chart(chart1, {
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
                                    max: Math.max.apply(Math, uv),
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }

            function plotPM(readno, pm2, pm5, id) {
                var chart1 = document.getElementById(id);
                var max = [Math.max.apply(Math, pm2), Math.max.apply(Math, pm5)];
                if(vm[id]) {
                    vm[id].destroy();
                }
                vm[id] = new Chart(chart1, {
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
                                    labelString: 'in µ/m³'
                                },
                                ticks: {
                                    max: Math.max.apply(Math, max),
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
                        $location.url("/home");
                    });
            }
        }
})();
