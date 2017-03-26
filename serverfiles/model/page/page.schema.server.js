/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var pageSchema = mongoose.Schema({
        _website: {type: String, required: true},
        name: {type: String, required: true},
        title: {type: String},
        description: {type: String},
        widgets: [{type: mongoose.Schema.Types.ObjectId, ref: 'WidgetModel'}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'PageModel'});

    return pageSchema;
};

