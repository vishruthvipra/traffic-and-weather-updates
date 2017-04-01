/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app, model) {
    app.post("/api/user", createUser);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    var userModel = model.userModel;

    function createUser(req, res) {
        var newUser = req.body;
        userModel
            .createUser(newUser)
            .then(function(user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUser(req, res) {
        var username = req.query.username;
        var password = req.query.password;
        if (username && password) {
            findUserByCredentials(req, res);
        }
        else if (username) {
            findUserByUsername(req, res);
        }
        else {
            findAllUsers(req,res);
        }
    }

    function findAllUsers(req, res) {
        userModel
            .findAllUsers()
            .then(function (users) {
                res.json(users);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUserByCredentials (req, res) {
        var username = req.query.username;
        var password = req.query.password;

        userModel
            .findUserByCredentials(username, password)
            .then(function (user) {
                res.json(user);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUserByUsername(req, res) {
        var username = req.query.username;
        userModel
            .findUserByUsername(username)
            .then(function (user) {
                if (user) {
                    res.json(user);
                }
                else {
                    res.sendStatus(500).send();
                }
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function findUserById (req, res) {
        var userId = req.params.userId;
        userModel.findUserById(userId)
            .then(function(user){
                res.json(user);
            });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;

        userModel
            .updateUser(userId, user)
            .then(function(status){
                res.sendStatus(200).send(status);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function deleteUser(req, res) {
        var userId = req.params.userId;
        userModel
            .deleteUser(userId)
            .then(function (status) {
                res.sendStatus(200).send(status);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }
};