/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function(app, mongoose) {
    var userSchema = mongoose.Schema({
        username: {type: String, required: true},
        email: {type: String},
        password: {type: String, required: true},
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        phone: {type: String},
        dateCreated: {type: Date, default: Date.now}
    }, {collection: 'UserModel'});

    return userSchema;
};