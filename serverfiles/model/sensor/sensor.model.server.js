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
        var deferred = q.defer();
        sensorModel.findOne({latitude: latitude, longitude: longitude}, function(err, sensor) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(sensor.readings);
            }
        });
        // sensorModel
        //     .create({
        //         latitude: latitude,
        //         longitude: longitude,
        //         location: "Bangalore"})
        //         //readings: [_id : ObjectId("58d73251b6691107272aef9f")],
        //         //dateCreated: {type: Date, default: Date.now}})
        //     .then(function (err, status) {
        //         if (err) {
        //             deferred.reject(new Error(err));
        //         } else {
        //             deferred.resolve(status);
        //         }
        //     });


        // sensorModel.find(function(err, sensor) {
        //     if (err) {
        //         deferred.reject(new Error(err));
        //     } else {
        //         console.log(sensor);
        //         deferred.resolve(sensor.readings);
        //     }
        // });
        // sensorModel.findOne({latitude: latitude, longitude: longitude})
        //     .populate('readings')
        //     .exec(function(err, sensor){
        //         if(err) {
        //             deferred.reject(new Error(err));
        //         } else {
        //             deferred.resolve(sensor.readings);
        //         }
        //     });
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