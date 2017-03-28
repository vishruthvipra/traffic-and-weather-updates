/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var sensorSchema = require('./sensor.schema.server.js')(app, mongoose);
    var sensorModel = mongoose.model('sensorModel', sensorSchema);

    var api = {
        findSensorById: findSensorById,
        findSensors: findSensors,
        updateSensor: updateSensor
    };
    return api;

    function findSensorById(sensorId) {
        var deferred = q.defer();
        sensorModel.findById(sensorId, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findSensors(latitude, longitude) {
        var lat = parseFloat(latitude);
        var lon = parseFloat(longitude);
        var deferred = q.defer();
        sensorModel.find({location: {$near: [lat, lon]}}, function (err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor[0].readings);
            }
        });
        return deferred.promise;
    }

    function updateSensor(sensorId, sensor) {
        var deferred = q.defer();
        sensorModel.update({_id: sensorId}, {$set: sensor}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }
};