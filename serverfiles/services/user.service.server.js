/**
 * Created by vishruthkrishnaprasad on 20/2/17.
 */
module.exports = function (app, model, passport) {
    var bcrypt = require("bcrypt-nodejs");
    var LocalStrategy = require('passport-local').Strategy;
    var FacebookStrategy = require('passport-facebook').Strategy;
    var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

    var facebookConfig = {
        // clientID: "1448775658506982",//process.env.FACEBOOK_CLIENT_ID,
        clientID: process.env.FACEBOOK_CLIENT_ID,
        clientSecret: "1a0732340195b6d4c9e0ab0ca43c2882",//process.env.FACEBOOK_CLIENT_SECRET,
        callbackURL: "http://webdevproject.herokuapp.com/auth/facebook/callback",//process.env.FACEBOOK_CALLBACK_URL,
        profileFields: ['id', 'displayName', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified']
    };

    var googleConfig = {
        clientID: "668761646032-b2298dh6dhsnenpu1joe1h5q3h35beci.apps.googleusercontent.com",//process.env.GOOGLE_CLIENT_ID,
        clientSecret: "Lyd0Xi48a64Sws_ycTZrBabB",//process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://webdevproject.herokuapp.com/auth/google/callback"//process.env.GOOGLE_CALLBACK_URL
    };

    passport.use(new LocalStrategy(localStrategy));
    passport.use(new FacebookStrategy(facebookConfig, facebookStrategy));
    passport.use(new GoogleStrategy(googleConfig, googleStrategy));

    passport.serializeUser(serializeUser);
    passport.deserializeUser(deserializeUser);


    app.get('/auth/facebook', passport.authenticate('facebook', {scope: 'email'}));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', {
        failureRedirect: 'http://webdevproject.herokuapp.com/project/#/home'
    }), function (req, res) {
        var url = 'http://webdevproject.herokuapp.com/project/#/user/' + req.user._id.toString();
        res.redirect(url);
    });

    app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));
    app.get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: 'http://webdevproject.herokuapp.com/project/#/home'
    }), function (req, res) {
            var url = 'http://webdevproject.herokuapp.com/project/#/user/' + req.user._id.toString();
            res.redirect(url);
        });

    function facebookStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByFacebookId(profile.id)
            .then(function (user) {
                    if (user) {
                        // If User exists
                        return done(null, user);
                    } else {
                        var names = profile.displayName.split(" ");
                        var newFacebookUser = {
                            username: names[0],
                            firstName: names[0],
                            lastName: names[1],
                            role: "NORMAL",
                            facebook: {
                                id: profile.id,
                                token: token
                            },
                            email: profile.emails[0].value
                        };
                        return userModel.createUser(newFacebookUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                })
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                });
    }

    function googleStrategy(token, refreshToken, profile, done) {
        userModel
            .findUserByGoogleId(profile.id)
            .then(
                function (user) {
                    if (user) {
                        return done(null, user);
                    }
                    else {
                        var email = profile.emails[0].value;
                        var emailParts = email.split("@");
                        var newGoogleUser = {
                            role: "NORMAL",
                            username: emailParts[0],
                            firstName: profile.name.givenName,
                            lastName: profile.name.familyName,
                            email: email,
                            google: {
                                id: profile.id,
                                token: token
                            }
                        };
                        return userModel.createUser(newGoogleUser);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                })
            .then(
                function (user) {
                    return done(null, user);
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                });
    }

    app.post('/api/login', passport.authenticate('local'), login);
    app.post('/api/logout', logout);
    app.get('/api/loggedin', loggedin);
    app.post('/api/register', register);
    app.put("/api/user/:userId/message", updateMessage);
    app.delete("/api/user/:userId/message/:messageId",deleteMessage);
    app.get("/api/user", findUser);
    app.get("/api/user/:userId", findUserById);
    app.put("/api/user/:userId", updateUser);
    app.delete("/api/user/:userId", deleteUser);

    var userModel = model.userModel;

    function localStrategy(username, password, done) {
        userModel
            .findUserByUsername(username)
            .then(
                function (user) {
                    if (user != null && user.username === username && bcrypt.compareSync(password, user.password)) {
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                },
                function (err) {
                    if (err) {
                        return done(err);
                    }
                }
            );
    }

    function serializeUser(user, done) {
        done(null, user);
    }

    function deserializeUser(user, done) {
        userModel
            .findUserById(user._id)
            .then(
                function (user) {
                    done(null, user);
                },
                function (err) {
                    done(err, null);
                }
            );
    }

    function login(req, res) {
        var user = req.user;
        res.json(user);
    }

    function logout(req, res) {
        req.logOut();
        res.send(200);
    }

    function loggedin(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    }

    function register(req, res) {
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .createUser(user)
            .then(function (user) {
                if (user) {
                    req.login(user, function (err) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.json(user);
                        }
                    });
                }
            });
    }


    function updateMessage(req, res) {
        var userId = req.params.userId;
        var message = req.body;
        userModel
            .updateMessage(userId, message)
            .then(function (status) {
                res.sendStatus(200).send(status);
            }, function (error) {
                res.sendStatus(500).send(error);
            });
    }

    function deleteMessage(req, res) {
        var userId = req.params.userId;
        var messageId = req.params.messageId;
        userModel
            .deleteMessage(userId, messageId)
            .then(function (status) {
                res.sendStatus(200).send(status);
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
            findAllUsers(req, res);
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

    function findUserByCredentials(req, res) {
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

    function findUserById(req, res) {
        var userId = req.params.userId;
        userModel.findUserById(userId)
            .then(function (user) {
                res.json(user);
            });
    }

    function updateUser(req, res) {
        var userId = req.params.userId;
        var user = req.body;
        user.password = bcrypt.hashSync(user.password);
        userModel
            .updateUser(userId, user)
            .then(function (status) {
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

// app.post("/api/user", createUser);
// app.get("/api/user", findUser);

// app.put("/api/user/:userId", updateUser);
// app.delete("/api/user/:userId", deleteUser);