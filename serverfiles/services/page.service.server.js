/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app) {
    app.post("/api/website/:websiteId/page", createPage);
    app.get("/api/website/:websiteId/page", findPage);
    app.get("/api/page/:pageId", findPageById);
    app.put("/api/page/:pageId", updatePage);
    app.delete("/api/page/:pageId", deletePage);

    var autoincr = 600;
    var pages = [
        {"_id": "321", "name": "Post 1", "websiteId": "456", "description": "Lorem"},
        {"_id": "432", "name": "Post 2", "websiteId": "789", "description": "Lorem"},
        {"_id": "543", "name": "Post 3", "websiteId": "456", "description": "Lorem"},
        {"_id": "430", "name": "Post 10", "websiteId": "789", "description": "Lorem"}
    ];

    function findPage(req, res) {
        var websiteId = req.params.websiteId;
        var name = req.query.name;
        if (websiteId && name) {
            findPageByName(req, res);
        }
        else if (websiteId){
            findAllPages(req, res);
        }
    }

    function findPageByName(req, res) {
        var name = req.query.name;
        var page = pages.find(function (p) {
            return p.name == name;
        });
        if (page) {
            res.json(page);
        }
        else {
            res.sendStatus(400);
        }
    }

    function createPage(req, res) {
        var newPage = req.body;
        var websiteId = req.params.websiteId;
        pages.push({_id: String(autoincr),
            name: newPage.name,
            websiteId: websiteId,
            description: newPage.description
        });
        autoincr++;
        res.json(pages[pages.length - 1]);
        return;
    }

    function findAllPages (req, res) {
        var websiteId = req.params.websiteId;
        var sites = [];
        for (var p in pages) {
            if(websiteId == pages[p].websiteId) {
                sites.push(pages[p])
            }
        }
        res.json(sites);
    }

    function findPageById(req, res) {
        var pageId = req.params.pageId;
        var page = pages.find(function (p) {
            if(p._id == pageId) {
                return pageId;
            }
        });
        res.json(page);
    }

    function updatePage(req, res) {
        var pageId = req.params.pageId;
        var newPage = req.body;
        for (var p in pages) {
            if(pages[p]._id == pageId) {
                pages[p].name = newPage.name;
                pages[p].description = newPage.description;
                res.json(pages[p]);
                return;
            }
        }
    }

    function deletePage(req, res) {
        var pageId = req.params.pageId;
        for (var p in pages) {
            if(pages[p]._id == pageId) {
                var pageDeleted = pages[p];
                pages.splice(p,1);
                res.send(pageDeleted);
                return;
            }
        }
    }
};