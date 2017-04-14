/**
 * Created by vishruthkrishnaprasad on 6/4/17.
 */
module.exports = function(app, mongoose) {
    var trafficSchema = mongoose.Schema({
        _sensorId: {type: String, required: true},
        readno: {type: String, required: true},
        noofcars: {type: String},
        colevel: {type: String},
        solevel: {type: String},
        nolevel: {type: String},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'TrafficModel'});

    return trafficSchema;
};