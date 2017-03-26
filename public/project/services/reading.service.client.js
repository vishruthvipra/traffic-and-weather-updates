/**
 * Created by vishruthkrishnaprasad on 11/2/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("ReadingService", readingService);

    function readingService($http) {

        var api = {
            "getReadings": getReadings,
        };

        return api;

        function getReadings(latitude, longitude) {
            return $http.get("/api/reading?latitude=" + latitude + "&longitude=" + longitude);
        }
    }
})();