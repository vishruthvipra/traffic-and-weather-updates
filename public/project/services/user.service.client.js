/**
 * Created by vishruthkrishnaprasad on 11/2/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("UserService", userService);

    function userService($http) {

        var api = {
            "login": login,
            "logout": logout,
            "register": register,
            // "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "findAllUsers": findAllUsers
        };

        return api;

        function login(user) {
            return $http.post("/api/login", user);
        }

        function logout() {
            return $http.post("/api/logout");
        }

        function register(user) {
            return $http.post("/api/register", user);
        }

        /*function createUser(user) {
            return $http.post("/api/user", user);
        }*/

        function findUserById(userId) {
            return $http.get("/api/user/" + userId);
        }

        function findUserByCredentials(username, password) {
            return $http.get("/api/user?username=" + username + "&password=" + password);
        }

        function updateUser(userId, user) {
            return $http.put("/api/user/" + userId, user);
        }

        function deleteUser(userId, user) {
            return $http.delete("/api/user/" + userId, user);
        }
        
        function findUserByUsername(username) {
            return $http.get("/api/user?username=" + username);
        }

        function findAllUsers() {
            return $http.get("/api/user");
        }
    }
})();