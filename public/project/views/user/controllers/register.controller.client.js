/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("RegisterController", registerController)
    function registerController(UserService, $location) {
        var vm = this;
        vm.register = register;

        function init() {

        }
        init();


        function register(user) {
            var newUser = UserService
                .findUserByUsername(user.username)
                .success(function (user) {
                    vm.message = "User already exists"; })
                .error(function (err) {
                    UserService
                        .createUser(user)
                        .success(function (user) {
                            $location.url("user/" + user._id);
                        })
                });
        }
    }

})();
