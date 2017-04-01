/**
 * Created by vishruthkrishnaprasad on 11/2/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("SensorService", sensorService);

    function sensorService($http) {

        var api = {
            "findSensorByCoordinates": findSensorByCoordinates,
            "findSensorById": findSensorById,
            "findAllSensors" :findAllSensors
        };

        return api;

        function findSensorByCoordinates(latitude, longitude) {
            return $http.get("/api/sensor?latitude=" + latitude + "&longitude=" + longitude);
        }

        function findSensorById(sensorId) {
            return  $http.get("/api/" + sensorId);
        }

        function findAllSensors() {
            return $http.get("/api/sensor");
        }
    }
})();