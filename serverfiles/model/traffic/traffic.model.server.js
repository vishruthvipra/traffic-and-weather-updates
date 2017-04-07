/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var trafficSchema = require('./traffic.schema.server.js')(app, mongoose);
    var trafficModel = mongoose.model('trafficModel', trafficSchema);

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
        trafficModel.create(reading, function (err, status) {
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
        trafficModel.update({_id: readingId}, {$set: reading}, function (err, status) {
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
        trafficModel.remove({_id: readingId}, function (err, status) {
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
        trafficModel.findById(readingId, function (err, status) {
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
        trafficModel.find(function(err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor);
            }
        });
        return deferred.promise;
    }
};