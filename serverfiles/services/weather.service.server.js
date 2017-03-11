/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app) {
    app.post("/api/loc", createUser);
    app.get("/api/loc", findUser);
    app.get("/api/loc/:locId", findUserById);
    app.put("/api/loc/:locId", updateUser);
    app.delete("/api/loc/:locId", deleteUser);

    var autoincr = 500;
    var locs = [
        {_id: "123", locname: "alice", temperature: "30", humidity: "60", pressure: "60"},
        {_id: "234", locname: "bob", temperature: "20", humidity: "67", pressure: "68"},
        {_id: "345", locname: "charly", temperature: "35", humidity: "20", pressure: "80"},
        {_id: "456", locname: "jannunzi", temperature: "23", humidity: "50", pressure: "40"}
    ];

    function createUser(req, res) {
        var newUser = req.body;
        locs.push({_id: String(autoincr),
            locname: newUser.locname,
            email: newUser.email,
            password: newUser.password,
            firstName: newUser.firstName,
            lastName: newUser.lastName});
        autoincr++;
        res.json(locs[locs.length - 1]);
        return;
    }

    function findUser(req, res) {
        var locname = req.query.locname;
        var password = req.query.password;
        if (locname && password) {
            findUserByCredentials(req, res);
        }
        else if (locname){
            findUserByUsername(req, res);
        }
    }

    function findUserByCredentials (req, res) {
        var locname = req.query.locname;
        var password = req.query.password;

        var loc = locs.find(function (loc) {
            return loc.locname == locname && loc.password == password;
        });
        res.json(loc);
    }

    function findUserByUsername(req, res) {
        var loc = locs.find(function (loc) {
            return loc.locname == req.query.locname;
        });
        if (loc) {
            res.json(loc);
        }
        else {
            res.sendStatus(400);
        }
    }

    function findUserById (req, res) {
        var locId = req.params.locId;
        var loc = locs.find(function (u) {
            return u._id == locId;
        });
        res.json(loc);
    }

    function updateUser(req, res) {
        var locId = req.params.locId;
        var newUser = req.body;
        for (var u in locs) {
            if (locs[u]._id == locId) {
                locs[u].firstName = newUser.firstName;
                locs[u].email = newUser.email;
                locs[u].lastName = newUser.lastName;
                res.json(locs[u]);
                return;
            }
        }
    }

    function deleteUser(req, res) {
        var locId = req.params.locId;
        for (var u in locs) {
            if(locs[u]._id == locId) {
                var locDeleted = locs[u];
                locs.splice(u,1);
                res.send(locDeleted);
                return;
            }
        }
    }
};