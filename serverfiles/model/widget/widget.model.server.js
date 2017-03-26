/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var widgetSchema = require('./widget.schema.server')(app, mongoose);
    var widgetModel = mongoose.model('WidgetModel', widgetSchema);

    var api = {
        createWidget: createWidget,
        findAllWidgetsForPage: findAllWidgetsForPage,
        findWidgetById: findWidgetById,
        findWidgetByName: findWidgetByName,
        updateWidget: updateWidget,
        deleteWidget: deleteWidget,
        reorderWidget: reorderWidget
    };
    return api;

    function createWidget(pageId, widget) {
        var deferred = q.defer();
        widget._page = pageId;
        widgetModel.create(widget, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findAllWidgetsForPage(pageId) {
        var deferred = q.defer();
        widgetModel.find({_page: pageId}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findWidgetById(widgetId) {
        var deferred = q.defer();
        widgetModel.findById(widgetId, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findWidgetByName(name) {
        var deferred = q.defer();
        widgetModel.findOne({name: name}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            }
            else if (status) {
                deferred.resolve(status);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function updateWidget(widgetId, widget) {
        var deferred = q.defer();
        widgetModel.update({_id: widgetId}, {$set: widget}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function deleteWidget(widgetId) {
        var deferred = q.defer();
        widgetModel.remove({_id: widgetId}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function reorderWidget(pageId, start, end) {
        var deferred = q.defer();
        model.find().sort({ name: 'criteria' })
            .exec(function (err, status) {
                if (err) {
                    deferred.reject(new Error(err));
                } else {
                    deferred.resolve(status);
                }
            });
        return deferred.promise;
    }
};
