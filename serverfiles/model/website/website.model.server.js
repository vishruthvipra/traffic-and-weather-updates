/**
 * Created by vishruthkrishnaprasad on 11/3/17.
 */
module.exports = function (app, mongoose) {
    var q = require('q');
    var websiteSchema = require('./website.schema.server')(app, mongoose);
    var websiteModel = mongoose.model('websiteModel', websiteSchema);

    var api = {
        addPage: addPage,
        deletePage: deletePage,
        createWebsiteForUser: createWebsiteForUser,
        findAllWebsitesForUser: findAllWebsitesForUser,
        findWebsiteById: findWebsiteById,
        findWebsiteByName: findWebsiteByName,
        updateWebsite: updateWebsite,
        deleteWebsite: deleteWebsite
    };
    return api;

    function addPage(websiteId, pageId) {
        var deferred = q.defer();
        websiteModel
            .findById(websiteId, function (err, website) {
                website.pages.push(pageId);
                website.save();
                deferred.resolve(website);
            });
        return deferred.promise;
    }

    function deletePage(websiteId, pageId) {
        var deferred = q.defer();
        websiteModel
            .findById(websiteId, function (err, website) {
                var index = website.pages.indexOf(pageId);
                website.pages.splice(index, 1);
                website.save();
                deferred.resolve(website);
            });
        return deferred.promise;
    }

    function createWebsiteForUser(userId, website) {
        var deferred = q.defer();
        website._user = userId;
        websiteModel.create(website, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;

        //console.log("reached here");
        //return websiteModel.create(website);
    }

    function findAllWebsitesForUser(userId) {
        var deferred = q.defer();
        websiteModel.find({_user: userId}, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
        // return websiteModel.find({_user: userId});
        //return websiteModel.findById(userId);
    }

    function findWebsiteById(websiteId) {
        var deferred = q.defer();
        websiteModel.findById(websiteId, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
        // return websiteModel.findById(websiteId);
    }

    function findWebsiteByName(name) {
        var deferred = q.defer();
        websiteModel.findOne({name: name}, function (err, status) {
            if (err) {
                deferred.reject(new Error(err));
            }
            else if(status) {
                deferred.resolve(status);
                // deferred.reject(err);
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
        // return websiteModel.findOne({name: name});
    }

    function updateWebsite(websiteId, website) {
        var deferred = q.defer();
        websiteModel.update({_id: websiteId}, {$set: website}, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
        // return websiteModel.update({_id: websiteId}, {$set: website});
    }

    function deleteWebsite(websiteId) {
        var deferred = q.defer();
        websiteModel.remove({_id: websiteId}, function (err, status) {
            if(err) {
                deferred.reject(new Error(err));
            } else {
                deferred.resolve(status);
            }
        });
        return deferred.promise;
        // return websiteModel.remove({_id: websiteId});
    }

};
