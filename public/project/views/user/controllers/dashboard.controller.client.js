/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("DashboardController", dashboardController)
        function dashboardController($routeParams, UserService) {
            var vm = this;
            var userId = $routeParams["uid"];

            function init() {
                var promise = UserService.findUserById(userId);
                promise.success(function (user) {
                    vm.user = user;
                    vm.hidden = true;
                });

                // $("#drop-down").hide();
                // $("#gov-level-2").hide();
                // $("#parking-level-2").hide();
                // $("#ticketing-level-2").hide();
                // $("#ticketing-level-3").hide();
                // $("#traffic-level-2").hide();
            }

            init();
        }

})();
