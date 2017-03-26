/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var widgetSchema = mongoose.Schema({
        _page: {type: String, required: true},
        type: {type: String, enum: ['HEADING', 'IMAGE', 'YOUTUBE', 'HTML', 'TEXT'], required: true},
        name: {type: String},
        text: {type: String},
        placeholder: {type: String},
        description: {type: String},
        url: {type: String},
        width: {type: String},
        height: {type: String},
        rows: {type: Number},
        size: {type: Number},
        class: {type: String},
        icon: {type: String},
        deletable: {type: Boolean},
        formatted: {type: Boolean},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'WidgetModel'});

    return widgetSchema;
};