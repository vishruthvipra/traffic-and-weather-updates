/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var weatherSchema = mongoose.Schema({
        _sensorId: {type: String, required: true},
        readno: {type: String, required: true},
        temperature: {type: String},
        humidity: {type: String},
        waterlevel: {type: String},
        uvlevel: {type: String},
        pressure: {type: String},
        colevel: {type: String},
        pm2: {type: String},
        pm5: {type: String},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'weatherModel'});

    return weatherSchema;
};