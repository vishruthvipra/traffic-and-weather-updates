/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var pageSchema = require('./page.schema.server')(app, mongoose);
    var pageModel = mongoose.model('pageModel', pageSchema);

    var api = {
        addWidget: addWidget,
        deleteWidget: deleteWidget,
        createPage: createPage,
        findAllPagesForWebsite: findAllPagesForWebsite,
        findPageById: findPageById,
        findPageByName: findPageByName,
        updatePage: updatePage,
        deletePage: deletePage,
        findAllWidgetsForPage: findAllWidgetsForPage,
        reorderWidgets: reorderWidgets

    };
    return api;

    function addWidget(pageId, widgetId) {
        var deferred = q.defer();
        pageModel
            .findById(pageId, function (err, page) {
                page.widgets.push(widgetId);
                page.save();
                deferred.resolve(page);
            });
        return deferred.promise;
    }

    function deleteWidget(pageId, widgetId) {
        var deferred = q.defer();
        pageModel
            .findById(pageId, function (err, page) {
                var index = page.widgets.indexOf(widgetId);
                page.widgets.splice(index, 1);
                page.save();
                deferred.resolve(page);
            });
        return deferred.promise;
    }

    function createPage(websiteId, page) {
        var deferred = q.defer();
        page._website = websiteId;
        pageModel.create(page, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findAllPagesForWebsite(websiteId) {
        var deferred = q.defer();
        pageModel.find({_website: websiteId}, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findPageById(pageId) {
        var deferred = q.defer();
        pageModel.findById(pageId, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findPageByName(name) {
        var deferred = q.defer();
        pageModel.findOne({name: name}, function (err, status) {
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

    function updatePage(pageId, page) {
        var deferred = q.defer();
        pageModel.update({_id: pageId}, {$set: page}, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function deletePage(pageId) {
        var deferred = q.defer();
        pageModel.remove({_id: pageId}, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
    }

    function findAllWidgetsForPage(pageId) {
        var deferred = q.defer();
        pageModel
            .findById(pageId)
            .populate('widgets')
            .exec(function(err, page){
                if(err) {
                    deferred.reject(new Error(err));
                } else {
                    deferred.resolve(page.widgets);
                }
            });

        // pageModel.find({_id: pageId}, {"widgets": 1, "_id": 0}, function (err, status) {
        //     if(err) {
        //         deferred.reject(new Error(err));
        //     } else {
        //         deferred.resolve(status);
        //     }
        // });
        return deferred.promise;
    }

    function reorderWidgets(pageId, start, end) {
        var deferred = q.defer();
        pageModel.findById(pageId)
            .populate('widgets')
            .exec(function(err, page){
                if(err) {
                    deferred.reject(new Error(err));
                } else {
                    page.widgets.splice(end, 0, page.widgets.splice(start, 1)[0]);
                    page.save();
                    deferred.resolve(page.widgets);
                }
            });

        return deferred.promise;
    }
};