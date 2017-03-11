/**
 * Created by vishruthkrishnaprasad on 11/2/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("WeatherService", WeatherService);

    function WeatherService($http) {

        var api = {
            "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "updateUser": updateUser,
            "deleteUser": deleteUser
        };

        return api;

        function createUser(loc) {
            return $http.post("/api/loc", loc);
        }

        function findUserById(locId) {
            return $http.get("/api/loc/" + locId);
        }

        function findUserByCredentials(locname, password) {
            return $http.get("/api/loc?locname=" + locname + "&password=" + password);
        }

        function updateUser(locId, loc) {
            return $http.put("/api/loc/" + locId, loc);
        }

        function deleteUser(locId, loc) {
            return $http.delete("/api/loc/" + locId, loc);
        }
        
        function findUserByUsername(locname) {
            return $http.get("/api/loc?locname=" + locname);
        }
    }
})();