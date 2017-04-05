/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("DashboardController", dashboardController)
        function dashboardController($routeParams, UserService, $location, $rootScope) {
            var vm = this;
            var userId = $routeParams["uid"];
            vm.logout = logout;

            function init() {
                var promise = UserService.findUserById(userId);
                promise.success(function (user) {
                    vm.user = user;
                    vm.hidden = true;
                });

                $("#drop-down").hide();
                $("#gov-level-2").hide();
                $("#parking-level-2").hide();
                $("#ticketing-level-2").hide();
                $("#ticketing-level-3").hide();
                $("#traffic-level-2").hide();

                uiEvents();
            }

            init();

            function uiEvents() {

                // $(document).on('click','#domains',function(){
                //     $("#gov-level-2").slideToggle("fast");
                // });

                $("#domains").on('click',function() {
                    $("#gov-level-2").slideToggle("fast");
                });

                $("#parking").on('click',function() {
                    $("#parking-level-2").slideToggle("fast");
                });

                $("#ticketing").on('click',function() {
                    $("#ticketing-level-2").slideToggle("fast");
                });

                $("#third-level").on('click',function() {
                    $("#ticketing-level-3").slideToggle("fast");
                });

                $("#traffic-drop-down").on('click',function() {
                    $("#traffic-level-2").slideToggle("fast");
                });
            }

            function logout() {
                UserService
                    .logout()
                    .then(function (response) {
                        $rootScope.currentUser = null;
                        $location.url("/home");
                    });
            }
    }

})();
