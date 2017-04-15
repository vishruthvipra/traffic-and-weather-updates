/**
 * Created by vishruthkrishnaprasad on 10/4/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("cityController", cityController)
    function cityController(UserService, $rootScope, $location) {
        vm = this;
        vm.logout = logout;

        function init() {

        }
        init();

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