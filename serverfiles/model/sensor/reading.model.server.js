/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var readingSchema = require('./reading.schema.server.js')(app, mongoose);
    var readingModel = mongoose.model('ReadingModel', readingSchema);

    var api = {
        findReadingById: findReadingById,
        findReadingsForCoordinates: findReadingsForCoordinates,
    };
    return api;

    function findReadingById(readingId) {
        var deferred = q.defer();
        readingModel.findById(readingId, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findReadingsForCoordinates(latitude, longitude) {
        var deferred = q.defer();
        readingModel.findOne({latitude: latitude, longitude: longitude}, function(err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor);
            }
        });
        return deferred.promise;
    }
};