/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var sensorSchema = require('./sensor.schema.server.js')(app, mongoose);
    var sensorModel = mongoose.model('SensorModel', sensorSchema);

    var api = {
        findSensorForCoordinates: findSensorForCoordinates,
        findSensorForCoordinatesAndSensorType: findSensorForCoordinatesAndSensorType,
        findSensorById: findSensorById,
        findSensorByIdAndSensorType: findSensorByIdAndSensorType,
        findSensorReading: findSensorReading,
        findReadingsForSensorId: findReadingsForSensorId,
        findAllSensorsForSensorType: findAllSensorsForSensorType,
        findAllSensors: findAllSensors
    };
    return api;

    function findSensorForCoordinates(latitude, longitude) {
        var lat = parseFloat(latitude);
        var lon = parseFloat(longitude);
        var deferred = q.defer();
        sensorModel.findOne({location: {latitude: lat, longitude: lon}}, function (err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor);
            }
        });
        return deferred.promise;

    }

    function findSensorForCoordinatesAndSensorType(latitude, longitude, sensorType) {
        var lat = parseFloat(latitude);
        var lon = parseFloat(longitude);
        var deferred = q.defer();
        sensorModel.findOne({location: {latitude: lat, longitude: lon}, sensorType: sensorType}, function (err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor);
            }
        });
        return deferred.promise;

    }

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

    function findSensorByIdAndSensorType(sensorId, sensorType) {
        var deferred = q.defer();
        sensorModel.findOne({_id: sensorId, sensorType: sensorType}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findAllSensorsForSensorType(sensorType) {
        var deferred = q.defer();
        sensorModel.find({sensorType: sensorType}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else if(status) {
                deferred.resolve(status);
            } else {
                deferred.reject(new Error(err));
            }
        });
        return deferred.promise;
    }

    function findAllSensors() {
        var deferred = q.defer();
        sensorModel.find(function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else if(status) {
                deferred.resolve(status);
            } else {
                deferred.reject(new Error(err));
            }
        });
        return deferred.promise;
    }

    function findSensorReading(latitude, longitude) {
        var lat = parseFloat(latitude);
        var lon = parseFloat(longitude);
        var deferred = q.defer();
        sensorModel.find({location: {$near: [lat, lon]}}, function (err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor[0].weatherReadings);
            }
        });
        return deferred.promise;
    }

    function findReadingsForSensorId(sensorId) {
        var deferred = q.defer();
        sensorModel.findById(sensorId)
            .populate('weatherReadings')
            .exec(function(err, sensor) {
                if (err || sensor === null) {
                    deferred.reject(new Error(err));
                } else {
                    deferred.resolve(sensor.weatherReadings);
                }
            });
        return deferred.promise;
    }
};