/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app, model) {
    app.get("/api/reading", findReadingsForCoordinates);
    app.get("/api/:sensorId/readings", findReadingsforSensorId);

    var sensorModel = model.sensorModel;
    var readingModel = model.readingModel;

    function findReadingsForCoordinates(req, res) {
        var latitude = req.query.latitude;
        var longitude = req.query.longitude;

        sensorModel
            .findSensors(latitude, longitude)
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




