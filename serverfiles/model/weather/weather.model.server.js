/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var weatherSchema = require('./weather.schema.server.js')(app, mongoose);
    var weatherModel = mongoose.model('WeatherModel', weatherSchema);

    var api = {
        createReading: createReading,
        updateReading: updateReading,
        deleteReading: deleteReading,
        findReadingById: findReadingById,
        findAllReadings: findAllReadings
    };
    return api;

    function createReading(reading) {
        var deferred = q.defer();
        weatherModel.create(reading, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function updateReading(readingId, reading) {
        var deferred = q.defer();
        weatherModel.update({_id: readingId}, {$set: reading}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function deleteReading(readingId) {
        var deferred = q.defer();
        weatherModel.remove({_id: readingId}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }


    function findReadingById(readingId) {
        var deferred = q.defer();
        weatherModel.findById(readingId, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findAllReadings() {
        var deferred = q.defer();
        weatherModel.find(function(err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor);
            }
        });
        return deferred.promise;
    }
};