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

                });
            }

            init();
        }

})();
