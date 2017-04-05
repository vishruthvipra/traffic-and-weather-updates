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
            "findAllSensors" :findAllSensors,
            "findSensorByCoordinatesWithSensorType": findSensorByCoordinatesWithSensorType,
            "findSensorByIdWithSensorType": findSensorByIdWithSensorType,
            "findAllSensorsForSensorType": findAllSensorsForSensorType
        };

        return api;

        function findSensorByCoordinates(latitude, longitude) {
            return $http.get("/api/sensor?latitude=" + latitude + "&longitude=" + longitude);
        }

        function findSensorById(sensorId) {
            return $http.get("/api/sensor?sensorId=" + sensorId);
        }

        function findAllSensors() {
            return $http.get("/api/sensor");
        }

        function findSensorByCoordinatesWithSensorType(latitude, longitude, sensorType) {
            return $http.get("/api/sensor?latitude=" + latitude + "&longitude=" + longitude + "&sensorType=" + sensorType);
        }

        function findSensorByIdWithSensorType(sensorId, sensorType) {
            return $http.get("/api/sensor?sensorId=" + sensorId + "&sensorType=" + sensorType);
        }

        function findAllSensorsForSensorType(sensorType) {
            //var sensortype = {stype: sensorType};
            return $http.get("/api/sensor?sensorType=" + sensorType);
        }
    }
})();