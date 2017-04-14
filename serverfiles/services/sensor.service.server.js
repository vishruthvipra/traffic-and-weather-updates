/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app, model) {
    app.post("/api/sensor", createSensor);
    app.put("/api/sensor/:sensorId", updateSensor);
    app.delete("/api/sensor/:sensorId", deleteSensor);
    app.get("/api/sensor/:sType/reading", findReadingsForCoordinates);
    app.get("/api/sensor", findSensor);
    app.get("/api/sensor/:latitudeid/:longitudeid/:sType", populateReadings);
    app.get("/api/:sensorId/weatherReadings", findReadingsforSensorId);

    var sensorModel = model.sensorModel;
    var weatherModel = model.weatherModel;
    var trafficModel = model.trafficModel;

    function populateReadings(req, res) {
        var latitude = req.params.latitudeid;
        var longitude = req.params.longitudeid;
        var sensorType = req.params.sType;
        sensorModel
            .populateReadings(latitude, longitude, sensorType)
            .then(function(sensor) {
                res.json(sensor);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function createSensor(req, res) {
        var newSensor = req.body;
        sensorModel
            .createSensor(newSensor)
            .then(function(sensor) {
                res.json(sensor);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function updateSensor(req, res) {
        var sensorId = req.params.sensorId;
        var sensor = req.body;

        if (sensor.sensorType === "WEATHER") {
            sensorModel
                .updateSensor(sensorId, sensor)
                .then(function (sensor) {
                    for (var i in sensor.weatherReadings) {
                        weatherModel.updateReadingSensorId(sensor.weatherReadings[i], sensorId);
                    }
                    res.sendStatus(200).send(status);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        }
        else {
            sensorModel
                .updateSensor(sensorId, sensor)
                .then(function (status) {
                    for (var i in sensor.trafficReadings) {
                        trafficModel.updateReadingSensorId(sensor.trafficReadings[i], sensorId);
                    }
                    res.sendStatus(200).send(status);
                }, function (error) {
                    res.sendStatus(500).send(error);
                });
        }

    }

    function deleteSensor(req, res) {
        var sensorId = req.params.sensorId;
        sensorModel
            .findSensorById(sensorId)
            .then(function (sensor) {
                if (sensor.sensorType === "WEATHER") {
                    for (var i in sensor.weatherReadings) {
                        weatherModel.deleteReading(sensor.weatherReadings[i]);
                    }
                    sensorModel
                        .deleteSensor(sensorId)
                        .then(function (status) {
                            res.sendStatus(200).send(status);
                        });
                }
                else {
                    for (var i in sensor.trafficReadings) {
                        trafficModel.deleteReading(sensor.trafficReadings[i]);
                    }
                    sensorModel
                        .deleteSensor(sensorId)
                        .then(function (status) {
                            res.sendStatus(200).send(status);
                        });
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findSensor(req, res) {
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        var sensorType = req.query.sensorType;
        var sensorId = req.query.sensorId;
        var forSensor = req.query.forSensor;

        if (sensorType) {
            if (latitude && longitude) {
                findSensorForCoordinatesAndSensorType(req, res);
            }
            else if (sensorId) {
                if(forSensor) {
                    findSensorForSensorIdAndSensorType(req, res);
                }
                else {
                    populateReadingsById(req, res);
                }
            }
            else {
                findAllSensorsForSensorType(req,res);
            }
        }
        else {
            if (latitude && longitude) {
                findSensorForCoordinates(req, res);
            }
            else if (sensorId) {
                findSensorForSensorId(req, res);
            }
            else {
                findAllSensors(req, res);
            }
        }

    }

    function findAllSensors(req, res) {
        sensorModel
            .findAllSensors()
            .then(function (sensors) {
                res.json(sensors);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findSensorForCoordinatesAndSensorType(req, res) {
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        var sensorType = req.query.sensorType;
        sensorModel
            .findSensorForCoordinatesAndSensorType(latitude, longitude, sensorType)
            .then(function (sensor) {
                res.json(sensor);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findSensorForCoordinates(req, res) {
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        sensorModel
            .findSensorForCoordinates(latitude, longitude)
            .then(function (sensor) {
                res.json(sensor);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findAllSensorsForSensorType(req,res) {
        var sensorType = req.query.sensorType;
        sensorModel
            .findAllSensorsForSensorType(sensorType)
            .then(function (sensors) {
                res.json(sensors);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function populateReadingsById(req, res) {
        var sensorId = req.query.sensorId;
        var sensorType = req.query.sensorType;
        sensorModel
            .populateReadingsById(sensorId, sensorType)
            .then(function (sensor) {
                res.json(sensor);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findSensorForSensorIdAndSensorType(req, res) {
        var sensorId = req.query.sensorId;
        var sensorType = req.query.sensorType;
        sensorModel
            .findSensorByIdAndSensorType(sensorId, sensorType)
            .then(function (sensor) {
                res.json(sensor);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findSensorForSensorId(req, res) {
        var sensorId = req.query.sensorId;
        sensorModel
            .findSensorById(sensorId)
            .then(function (sensor) {
                res.json(sensor);
            }, function (error) {
                res.sendStatus(500).send(error);
            });

    }

    function findReadingsForCoordinates(req, res) {
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        var sensorType = req.params.sType;
        sensorModel
            .findSensorReading(latitude, longitude, sensorType)
            .then(function (readings) {
                if (sensorType === "WEATHER")
                    return weatherModel.findReadingById(readings[0]);
                else {
                    return trafficModel.findReadingById(readings[0]);
                }
            })
            .then(function (reading) {
                res.json(reading);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findReadingsforSensorId(req, res) {
        var sensorId = req.params.sensorId;
        sensorModel
            .findReadingsForSensorId(sensorId)
            .then(function (readings) {
                res.json(readings);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }
};




