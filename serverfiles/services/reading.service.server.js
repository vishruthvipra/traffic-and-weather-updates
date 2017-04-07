/**
 * Created by vishruthkrishnaprasad on 5/4/17.
 */
module.exports = function (app, model) {
    app.post("/api/reading", createReading);
    app.put("/api/reading/sType/:sType", updateReading);
    app.delete("/api/reading/:readingId/sensor/:sensorId", deleteReading);
    app.get("/api/reading/:readingId/sType/:sType", findReadingForId);
    app.get("/api/reading/sType/:sType", findAllReadings);

    var sensorModel = model.sensorModel;
    var weatherModel = model.weatherModel;
    var trafficModel = model.trafficModel;

    function createReading(req, res) {
        var newReading = req.body;
        var sensorId = newReading._sensorId;
        sensorModel
            .findSensorById(sensorId)
            .then(function (sensor) {
                if (sensor === "") {
                    res.sendStatus(500).send(error);
                }
                if (sensor.sensorType === "WEATHER") {
                    weatherModel
                        .createReading(newReading)
                        .then(function (reading) {
                            sensor.weatherReadings = sensor.weatherReadings.push(reading._id);
                            sensorModel
                                .updateSensor(sensor._id, sensor)
                                .then(function (sensor) {
                                    res.sendStatus(200).send();
                                })
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        });
                }
                else {
                    trafficModel
                        .createReading(newReading)
                        .then(function (reading) {
                            sensor.trafficReadings = sensor.trafficReadings.push(reading._id);
                            sensorModel
                                .updateSensor(sensor._id, sensor)
                                .then(function (sensor) {
                                    res.sendStatus(200).send();
                                })
                            // res.json(sensor);
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        });
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function updateReading(req, res) {
        var reading = req.body;
        var readingId = reading._id;
        var sType = req.params.sType;
        if (sType === "WEATHER") {
            weatherModel
                .updateReading(readingId, reading)
                .then(function (status) {
                    res.sendStatus(200).send(status);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        }
        else {
            trafficModel
                .updateReading(readingId, reading)
                .then(function (status) {
                    res.sendStatus(200).send(status);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        }
    }

    function deleteReading(req, res) {
        var readingId = req.params.readingId;
        var sensorId = req.params.sensorId;
        sensorModel
            .findSensorById(sensorId)
            .then(function (sensor) {
                if (sensor === "") {
                    res.sendStatus(500).send(error);
                }
                if (sensor.sensorType === "WEATHER") {
                    weatherModel
                        .deleteReading(readingId)
                        .then(function (reading) {
                            var index = sensor.weatherReadings.indexOf(readingId);
                            sensor.weatherReadings.splice(index, 1);
                            sensor.save();
                            res.sendStatus(200).send();
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        });
                }
                else {
                    trafficModel
                        .deleteReading(readingId)
                        .then(function (reading) {
                            var index = sensor.trafficReadings.indexOf(readingId);
                            sensor.trafficReadings.splice(index, 1);
                            sensor.save();
                            res.sendStatus(200).send();
                        }, function (error) {
                            res.sendStatus(500).send(error);
                        });
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findReadingForId(req, res) {
        var sType = req.params.sType;
        if (sType === "WEATHER") {
            findWeatherReadingForId(req, res);
        }
        else {
            findTrafficReadingForId(req, res);
        }
    }

    function findWeatherReadingForId(req, res) {
        var readingId = req.params.readingId;
        weatherModel
            .findReadingById(readingId)
            .then(function (reading) {
                if (reading === "") {
                    res.sendStatus(500).send(error);
                }
                else if (reading) {
                    res.json(reading);
                }
                else {
                    res.sendStatus(500).send(error);
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            })
    }

    function findTrafficReadingForId(req, res) {
        var readingId = req.params.readingId;
        trafficModel
            .findReadingById(readingId)
            .then(function (reading) {
                if (reading === "") {
                    res.sendStatus(500).send(error);
                }
                else if (reading) {
                    res.json(reading);
                }
                else {
                    res.sendStatus(500).send(error);
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findAllReadings(req, res) {
        var sType = req.params.sType;
        if (sType === "WEATHER") {
            findAllWeatherReadings(req, res);
        }
        else {
            findAllTrafficReadings(req, res);
        }
    }

    function findAllWeatherReadings(req, res) {
        weatherModel
            .findAllReadings()
            .then(function (sensors) {
                res.json(sensors);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findAllTrafficReadings(req, res) {
        trafficModel
            .findAllReadings()
            .then(function (sensors) {
                res.json(sensors);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }
};




