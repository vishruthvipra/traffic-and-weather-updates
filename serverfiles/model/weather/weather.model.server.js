/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var weatherSchema = require('./weather.schema.server.js')(app, mongoose);
    var weatherModel = mongoose.model('weatherModel', weatherSchema);

    var api = {
        findReadingById: findReadingById,
        findReadingsForCoordinates: findReadingsForCoordinates
    };
    return api;

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

    function findReadingsForCoordinates(latitude, longitude) {
        var deferred = q.defer();
        weatherModel.findOne({latitude: latitude, longitude: longitude}, function(err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor);
            }
        });
        return deferred.promise;
    }
};