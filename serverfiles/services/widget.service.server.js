/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app) {
    var multer = require('multer');
    var upload = multer({ dest: __dirname+'/../../public/uploads' });
    app.post("/api/page/:pageId/widget", createWidget);
    app.get("/api/page/:pageId/widget", findWidget);
    app.get("/api/widget/:widgetId", findWidgetById);
    app.put("/api/widget/:widgetId", updateWidget);
    app.delete("/api/widget/:widgetId", deleteWidget);
    app.post ("/api/upload", upload.single('myFile'), uploadImage);


    var autoincr = 800;
    var widgets = [
        { "_id": "123", "widgetType": "HEADING", "pageId": "321", "size": 2, "text": "LADAKH", "description" : "" +
        "The land of dreams"},
        { "_id": "234", "widgetType": "HEADING", "pageId": "321", "size": 4, "text" : "Pangong Lake" , "description": "" +
        "Pangong Tso, " +
        "also referred to as Pangong Lake, is an endorheic lake in the Himalayas situated at a height of " +
        "about 4,350 m (14,270 ft)"},

        { "_id": "345", "widgetType": "IMAGE", "pageId": "321", "width": "100%", "text" : "Lake Image",
            "url": "http://s3.india.com/travel/wp-content/uploads/pangong-lake-preset2.jpg"},

        { "_id": "456", "widgetType": "HTML", "pageId": "321", "size": 4, "text": "HIMALAYAS", "description": "Its location"}
        ,
        { "_id": "567", "widgetType": "HEADING", "pageId": "321", "size": 4, "text": "" +
        "NLST is proposed to be on-axis alt-azimuth Gregorian", "description": "" +
        "multi-purpose open telescope with the provision of carrying out night time stellar observations using" +
        "a spectrograph which will be located at Ladakh. It hopes to resolve features on the Sun " +
        "of the size of about 0.1 arcsec."},

        { "_id": "678", "widgetType": "YOUTUBE", "pageId": "321", "width": "100%", "text": "Video of Ladakh",
            "description": "A 4k video timelapse of the city",
            "url": "https://www.youtube.com/AK-MUzWdpjU" },

        { "_id": "789", "widgetType": "HTML", "pageId": "321", "size": 4, "description": "An html part", "text": "" +
        "The idea was to just stop, stare and admire at the miracles of Nature in the dry desert territory." +
        "This also sounded like the perfect womb for making a timelapse or two." +
        "But alas ...we got addicted!" +
        "The trip spanned over 15 days and we came back with pretty amazing sequences." +
        "Here we present to you our timeless journeys in Ladakh."}
    ];

    function uploadImage(req, res) {
        console.log("reached upload image");
        var widgetId      = req.body.widgetId;
        var width         = req.body.width;
        var userId        = req.body.userId;
        var websiteId     = req.body.websiteId;
        var pageId        = req.body.pageId;
        var myFile        = req.file;

        var originalname  = myFile.originalname; // file name on user's computer
        var filename      = myFile.filename;     // new file name in upload folder
        var path          = myFile.path;         // full path of uploaded file
        var destination   = myFile.destination;  // folder where file is saved to
        var size          = myFile.size;
        var mimetype      = myFile.mimetype;

        for(var w in widgets) {
            if(widgets[w]._id == widgetId) {
                widgets[w].url = '/uploads/'+filename;
            }
        };

        var url = "/assignment/assignment2/#/user/" + userId + "/website/" + websiteId + "/page/" + pageId + "/widget";

        res.redirect(url);
    }

    function findWidget(req, res) {
        var pageId = req.params.pageId;
        var text = req.query.text;
        if (pageId && text) {
            findWidgetByName(req, res);
        }
        else if (pageId){
            findAllWidgets(req, res);
        }
    }

    function findWidgetByName(req, res) {
        var text = req.query.text;
        var page = widgets.find(function (p) {
            return p.text == text;
        });
        if (page) {
            res.json(page);
        }
        else {
            res.sendStatus(400);
        }
    }

    function createWidget(req, res) {
        var newWidget = req.body;
        var widgetType = newWidget[0].toString();
        var pageId = req.params.pageId;
        widgets.push({_id: String(autoincr),
            pageId: pageId,
            widgetType: widgetType,
            text: "no description",
            size: "no size",
            width: "no width"
        });
        autoincr++;
        res.json(widgets[widgets.length - 1]);
        return;
    }

    function findAllWidgets (req, res) {
        var pageId = req.params.pageId;
        var sites = [];
        for (var p in widgets) {
            if(pageId == widgets[p].pageId) {
                sites.push(widgets[p])
            }
        }
        res.json(sites);
    }

    function findWidgetById(req, res) {
        var widgetId = req.params.widgetId;
        var widget = widgets.find(function (p) {
            if(p._id == widgetId) {
                return widgetId;
            }
        });
        res.json(widget);
    }

    function updateWidget(req, res) {
        var widgetId = req.params.widgetId;
        var newWidget = req.body;
        for (var p in widgets) {
            if(widgets[p]._id == widgetId) {
                widgets[p].text = newWidget.text;
                widgets[p].description = newWidget.description;
                widgets[p].text = newWidget.text;
                widgets[p].size = newWidget.size;
                widgets[p].url = newWidget.url;
                widgets[p].width = newWidget.width;
                res.json(widgets[p]);
                return;
            }
        }
    }

    function deleteWidget(req, res) {
        var widgetId = req.params.widgetId;
        for (var p in widgets) {
            if(widgets[p]._id == widgetId) {
                var widgetDeleted = widgets[p];
                widgets.splice(p,1);
                res.send(widgetDeleted);
                return;
            }
        }
    }
};