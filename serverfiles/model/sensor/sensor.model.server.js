/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var sensorSchema = require('./sensor.schema.server.js')(app, mongoose);
    var sensorModel = mongoose.model('SensorModel', sensorSchema);

    var api = {
        findSensorById: findSensorById,
        findSensors: findSensors,
        findReadingsForSensorId: findReadingsForSensorId
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

    function findReadingsForSensorId(sensorId) {
        var deferred = q.defer();
        sensorModel.findById(sensorId)
            .populate('readings')
            .exec(function(err, sensor) {
                if (err) {
                    deferred.reject(new Error(err));
                } else {
                    deferred.resolve(sensor.readings);
                }
            });
        return deferred.promise;
    }
};