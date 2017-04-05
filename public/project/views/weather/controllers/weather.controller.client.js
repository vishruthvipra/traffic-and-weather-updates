/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("WeatherController", weatherController)
        function weatherController($routeParams, UserService, ReadingService) {
            var vm = this;
            var userId = $routeParams["uid"];
            vm.getLocationReadings = getLocationReadings;
            vm.findReadingsForSensorId = findReadingsForSensorId;
            var latitude = "12.9716", longitude = "77.5946";
            var deftemp = [12, 19, 3, 5, 2, 3];
            var defhumd = [12, 19, 3, 5, 2, 3];
            var defuv = [12, 19, 3, 5, 2, 3];
            var defpm2 = [12, 19, 3, 5, 2, 3];
            var defpm5 = [1, 9, 13, 15, 12, 30];
            var defreadno = [1, 2, 3, 4, 5, 6];

            vm.lati = latitude;
            vm.long = longitude;

            function init() {
                var promise = UserService.findUserById(userId);
                promise.success(function (user) {
                    vm.user = user;
                    getLocationReadings();
                    plotTemperature(defreadno, deftemp, "tempChart");
                    plotTemperature(defreadno, deftemp, "tempCharts");
                    plotHumidity(defreadno, defhumd, "humdChart");
                    plotHumidity(defreadno, defhumd, "humdCharts");
                    plotUVLevel(defreadno, defuv, "uvChart");
                    plotUVLevel(defreadno, defuv, "uvCharts");
                    plotPM(defreadno, defpm2, defpm5, "pmChart");
                    plotPM(defreadno, defpm2, defpm5, "pmCharts");
                });
            }
            init();

            function findReadingsForSensorId() {
                var data = [], temperature = [], humidity = [], uvlevel = [], pm2 = [], pm5 = [], readno = [];
                var sensorId = "58e1f921734d1d01a23a5467";
                var promise = ReadingService.findReadingsForSensorId(sensorId);
                promise.success(function (readings) {
                    for (var i in readings) {
                        data.push(readings[i].readno);
                        temperature.push(readings[i].temperature);
                        humidity.push(readings[i].humidity);
                        uvlevel.push(readings[i].uvlevel);
                        pm2.push(readings[i].pm2);
                        pm5.push(readings[i].pm5);
                    }
                    vm.temperature = readings[readings.length - 1];
                    console.log(vm.temperature);
                    readno = data.reverse();

                    plotTemperature(readno, temperature, "tempChart");
                    plotTemperature(readno, temperature, "tempCharts");
                    plotHumidity(readno, humidity, "humdChart");
                    plotHumidity(readno, humidity, "humdCharts");
                    plotUVLevel(readno, uvlevel, "uvChart");
                    plotUVLevel(readno, uvlevel, "uvCharts");
                    plotPM(readno, pm2, pm5, "pmChart");
                    plotPM(readno, pm2, pm5, "pmCharts");
                });
            }

            function getLocationReadings() {
                if(navigator.geolocation){
                    var options = {timeout:60000};
                    navigator.geolocation.getCurrentPosition(showLocation, errorHandler, options);
                }
                else{
                    alert("Sorry, browser does not support geolocation!");
                }

                function showLocation(position) {
                    var lat = position.coords.latitude;
                    var long = position.coords.longitude;
                    latitude = lat.toString();
                    longitude = long.toString();
                }

                function errorHandler(err) {
                    if(err.code == 1) {
                        alert("Error: Access is denied!");
                    }
                    else if( err.code == 2) {
                        console.log("Error: Position is unavailable!");
                    }
                }

                var promise = ReadingService
                    .findReadingsForCoordinates(latitude, longitude)
                    .success(function (reading) {
                        if (reading.temperature != "") {
                            vm.temperature = reading.temperature;
                            vm.humidity = reading.humidity;
                            vm.pressure = reading.pressure;
                            vm.uvlevel = reading.uvlevel;
                            vm.pm2 = "60";
                            vm.pm5 = "70";
                        }
                        else {
                            vm.error = "Incorrect credentials entered";
                        }
                    });
            }

            function plotTemperature(readno, temperature, id) {
                var chart1 = document.getElementById(id);
                var myChart = new Chart(chart1, {
                    type: 'line',
                    data: {
                        labels: readno,
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
                        labels: readno,
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
                        labels: readno,
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
                        labels: readno,
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
                                    max: 50,
                                    beginAtZero:true
                                }
                            }]
                        }
                    }
                });
            }
        }
})();