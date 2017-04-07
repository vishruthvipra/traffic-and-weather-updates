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
            "findReadingsForSensorId": findReadingsForSensorId,
            "findReadingForId": findReadingForId,
            "findAllReadings": findAllReadings
        };

        return api;

        function createReading(reading) {
            return $http.post("/api/reading", reading);
        }

        function updateReading(reading, sType) {
            return $http.put("/api/reading/sType/" + sType, reading);
        }

        function deleteReading(reading) {
            return $http.delete("/api/reading/" + reading._id + "/sensor/" + reading._sensorId);
        }

        function findReadingsForCoordinates(latitude, longitude) {
            return $http.get("/api/sensor/reading?latitude=" + latitude + "&longitude=" + longitude);
        }

        function findReadingsForSensorId(sensorId) {
            return $http.get("/api/" + sensorId + "/weatherReadings");
        }

        function findReadingForId(readingId, sType) {
            return $http.get("/api/reading/" + readingId + "/sType/" + sType);
        }

        function findAllReadings(sType) {
            return $http.get("/api/reading/sType/" + sType);
        }
    }
})();