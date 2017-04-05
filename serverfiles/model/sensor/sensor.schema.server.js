/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var sensorSchema = mongoose.Schema({
        location: {latitude: {type: Number, required: true}, longitude: {type: Number, required: true}},
        sensorType: {type: String, enum: ['WEATHER', 'TRAFFIC'], required: true},
        area: {type: String},
        weatherReadings: [{type: mongoose.Schema.Types.ObjectId, ref: 'WeatherModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'SensorModel'});

    sensorSchema.index({location: "2d"});
    return sensorSchema;
};