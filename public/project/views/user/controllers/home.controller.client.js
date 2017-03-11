/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("HomeController", HomeController);
        function HomeController(UserService, $location) {
            var vm = this;
            vm.login = login;
            vm.register = register;

            function init() {

            }
            init();

            function login(user) {
                var promise = UserService
                    .findUserByCredentials(user.username, user.password)
                    .success(function (user) {
                        if (user != "") {
                            $location.url("user/" + user._id);
                        }
                        else {
                            vm.error = "Incorrect credentials entered";
                        }
                    });

            }

            function register(user) {
                var newUser = UserService
                    .findUserByUsername(user.username)
                    .success(function (user) {
                        vm.error = "User already exists"; })
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
