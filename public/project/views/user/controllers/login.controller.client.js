/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */

(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", loginController)
        function loginController(UserService, $location) {
            var vm = this;
            vm.login = login;

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
        }

})();
