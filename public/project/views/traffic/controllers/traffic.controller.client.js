/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("TrafficController", trafficController)
        function trafficController($routeParams) {
            var vm = this;
            var userId = $routeParams["uid"];

            function init() {

            }

            init();
        }
})();