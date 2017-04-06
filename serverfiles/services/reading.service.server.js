/**
 * Created by vishruthkrishnaprasad on 5/4/17.
 */
module.exports = function (app, model) {
    app.post("/api/sensor", createSensor);
    app.put("/api/sensor/:sensorId", updateSensor);
    app.delete("/api/sensor/:sensorId", deleteSensor);
    app.get("/api/sensor/reading", findReadingsForCoordinates);
    app.get("/api/sensor", findSensor);
    //app.get("/api/:sensorId", findSensorForSensorId);
    app.get("/api/:sensorId/weatherReadings", findReadingsforSensorId);

    var sensorModel = model.sensorModel;
    var weatherModel = model.weatherModel;

    function createReading(req, res) {
        var newSensor = req.body;
        sensorModel
            .createSensor(newSensor)
            .then(function(sensor) {
                res.json(sensor);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function updateReading(req, res) {
        var sensorId = req.params.sensorId;
        var sensor = req.body;
        sensorModel
            .updateSensor(sensorId, sensor)
            .then(function (status) {
                res.sendStatus(200).send(status);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function deleteReading(req, res) {
        var sensorId = req.params.sensorId;
        sensorModel
            .deleteSensor(sensorId)
            .then(function (status) {
                res.sendStatus(200).send(status);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findSensor(req, res) {
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        var sensorType = req.query.sensorType;
        var sensorId = req.query.sensorId;

        if (sensorType) {
            if (latitude && longitude) {
                findSensorForCoordinatesAndSensorType(req, res);
            }
            else if (sensorId) {
                findSensorForSensorIdAndSensorType(req, res);
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








        // if(sensorType) {
        //     if (latitude && longitude) {
        //         findSensorForCoordinatesAndSensorType(req, res);
        //     }
        //     else {
        //         findAllSensorsForSensorType(req,res);
        //     }
        // }
        // else if (latitude && longitude) {
        //     findSensorForCoordinates(req, res);
        // }
        // else {
        //     findAllSensors(req, res);
        // }
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
        //var sensorType = sensortype.stype;
        sensorModel
            .findAllSensorsForSensorType(sensorType)
            .then(function (sensors) {
                res.json(sensors);
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
        sensorModel
            .findSensorReading(latitude, longitude)
            .then(function (readings) {
                return weatherModel.findReadingById(readings[0]);
            })
            .then(function (reading) {
                res.json(reading);
                //res.sendStatus(200);
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




