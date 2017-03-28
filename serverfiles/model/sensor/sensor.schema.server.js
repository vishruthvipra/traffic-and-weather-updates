/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var sensorSchema = mongoose.Schema({
        location: {latitude: {type: Number, required: true}, longitude: {type: Number, required: true}},
        area: {type: String},
        readings: [{type: mongoose.Schema.Types.ObjectId, ref: 'ReadingModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'SensorModel'});

    sensorSchema.index({location: "2d"});
    return sensorSchema;
};