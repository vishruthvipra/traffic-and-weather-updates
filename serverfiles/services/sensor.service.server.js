/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app, model) {
    app.get("/api/sensor", findSensor);
    app.get("/api/:sensorId", findSensorForSensorId);
    app.get("/api/reading", findReadingsForCoordinates);
    app.get("/api/:sensorId/readings", findReadingsforSensorId);

    var sensorModel = model.sensorModel;
    var readingModel = model.readingModel;

    function findSensor(req, res) {
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        if (latitude && longitude) {
            findSensorForCoordinates(req, res);
        }
        else {
            findAllSensors(req, res);
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

    function findSensorForCoordinates(req, res) {
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;
        sensorModel
            .findSensorForCoordinates(latitude, longitude)
            .then(function (sensor) {
                res.json(sensor);
                //res.sendStatus(200);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findSensorForSensorId(req, res) {
        var sensorId = req.params.sensorId;
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
                return readingModel.findReadingById(readings[0]);
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




