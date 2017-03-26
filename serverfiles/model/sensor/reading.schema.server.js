/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var readingSchema = mongoose.Schema({
        readno: {type: String, required: true},
        temperature: {type: String},
        humidity: {type: String},
        waterlevel: {type: String},
        uvlevel: {type: String},
        pressure: {type: String},
        colevel: {type: String},
        noofcars: {type: String},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'ReadingModel'});

    return readingSchema;
};