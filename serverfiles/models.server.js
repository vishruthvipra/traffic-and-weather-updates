/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app, mongoose, passport) {
    var userModel = require("./model/user/user.model.server.js")(app, mongoose);
    var sensorModel = require("./model/sensor/sensor.model.server.js")(app, mongoose);
    var weatherModel = require("./model/weather/weather.model.server.js")(app, mongoose);

    var model = {
        userModel: userModel,
        sensorModel: sensorModel,
        weatherModel: weatherModel
    };

    require("./services/user.service.server")(app, model, passport);
    require("./services/sensor.service.server")(app, model);
    // //require("./services/reading.service.server")(app, model);
};