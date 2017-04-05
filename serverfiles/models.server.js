/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app, mongoose, passport) {
    var userModel = require("./model/user/user.model.server.js")(app, mongoose);
    var sensorModel = require("./model/sensor/sensor.model.server.js")(app, mongoose);
    var weatherModel = require("./model/sensor/weather.model.server.js")(app, mongoose);
    var websiteModel = require("./model/website/website.model.server")(app, mongoose);
    var pageModel = require("./model/page/page.model.server")(app, mongoose);
    var widgetModel = require("./model/widget/widget.model.server")(app, mongoose);

    var model = {
        userModel: userModel,
        sensorModel: sensorModel,
        weatherModel: weatherModel,
        websiteModel: websiteModel,
        pageModel: pageModel,
        widgetModel: widgetModel
    };

    require("./services/user.service.server")(app, model, passport);
    require("./services/sensor.service.server")(app, model);
    //require("./services/reading.service.server")(app, model);
    require("./services/website.service.server")(app, model);
    require("./services/page.service.server")(app, model);
    require("./services/widget.service.server")(app, model);
};