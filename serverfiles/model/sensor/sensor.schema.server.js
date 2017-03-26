/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var sensorSchema = mongoose.Schema({
        latitude: {type: String, required: true},
        longitude: {type: String, required: true},
        location: {type: String},
        readings: [{type: mongoose.Schema.Types.ObjectId, ref: 'ReadingModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'SensorModel'});

    return sensorSchema;
};