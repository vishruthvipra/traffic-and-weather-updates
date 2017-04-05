/**
 * Created by vishruthkrishnaprasad on 11/2/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("ReadingService", readingService);

    function readingService($http) {

        var api = {
            "findReadingsForCoordinates": findReadingsForCoordinates,
            "findReadingsForSensorId": findReadingsForSensorId
        };

        return api;

        function findReadingsForCoordinates(latitude, longitude) {
            return $http.get("/api/sensor/reading?latitude=" + latitude + "&longitude=" + longitude);
        }

        function findReadingsForSensorId(sensorId) {
            return  $http.get("/api/" + sensorId + "/weatherReadings");
        }
    }
})();