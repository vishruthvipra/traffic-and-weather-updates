/**
 * Created by vishruthkrishnaprasad on 11/2/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("ReadingService", readingService);

    function readingService($http) {

        var api = {
            "createReading": createReading,
            "updateReading": updateReading,
            "deleteReading": deleteReading,
            "findReadingsForCoordinates": findReadingsForCoordinates,
            "findReadingsForSensorId": findReadingsForSensorId
        };

        return api;

        function createReading(reading) {
            return $http.post("/api/reading", reading);
        }

        function updateReading(readingId, reading) {
            return $http.put("/api/reading/" + readingId, reading);
        }

        function deleteReading(readingId) {
            return $http.delete("/api/reading/" + readingId);
        }

        function findReadingsForCoordinates(latitude, longitude) {
            return $http.get("/api/sensor/reading?latitude=" + latitude + "&longitude=" + longitude);
        }

        function findReadingsForSensorId(sensorId) {
            return $http.get("/api/" + sensorId + "/weatherReadings");
        }
    }
})();