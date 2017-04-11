/**
 * Created by vishruthkrishnaprasad on 10/4/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .factory("wikiService", wikiService);

    function wikiService($http) {
        var wikiService = {
            get: function() {
                return $http.jsonp('http://wikipedia.org/w/api.php?titles=bangalore&rawcontinue=true&action=query&format=json&prop=extracts&callback=JSON_CALLBACK');
            }
        };

        return wikiService;
    }
})();