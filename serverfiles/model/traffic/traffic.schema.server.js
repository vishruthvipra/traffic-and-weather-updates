/**
 * Created by vishruthkrishnaprasad on 6/4/17.
 */
module.exports = function(app, mongoose) {
    var trafficSchema = mongoose.Schema({
        readno: {type: String, required: true},
        noofcars: {type: String},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'trafficModel'});

    return trafficSchema;
};