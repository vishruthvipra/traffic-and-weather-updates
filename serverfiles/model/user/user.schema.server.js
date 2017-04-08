/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var userSchema = mongoose.Schema({
        username: {type: String, required: true},
        role: {type: String, enum: ['NORMAL', 'ADMIN', 'TADMIN', 'WADMIN'], required: true},
        email: {type: String},
        password: {type: String},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        phone: {type: String},
        facebook: {id: String, token: String},
        google: {id: String, token: String},
        messages: [{type: String}],
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'UserModel'});

    return userSchema;
};