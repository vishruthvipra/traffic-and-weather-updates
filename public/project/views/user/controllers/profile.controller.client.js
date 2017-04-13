/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", profileController)
        function profileController($routeParams, UserService, $location, $route, $timeout, loggedin) {
            var vm = this;
            vm.user = loggedin.data;
            var user = vm.user;
            var userId = user._id;
            vm.back = back;

            vm.updateUser = updateUser;
            vm.deleteUser = deleteUser;

            function init() {

            }

            init();

            // function back() {
            //     $timeout(function(){$route.reload();},1000);
            //     $location.url("/user/" + vm.user._id);
            // }

            function updateUser(newUser) {
                var update = UserService
                    .updateUser(userId, newUser)
                    .success(function (user) {
                        if(update != null)
                        {
                            vm.message = "User succesfully updated!"
                        }
                        else {
                            vm.error = "Unable to update..."
                        }
                });
            }
            
            function deleteUser(user) {
                var update = UserService
                    .deleteUser(userId)
                    .success(function (user) {
                        if (user != null) {
                            $location.url("login");
                        }
                        else {
                            vm.error = "Could not delete user";
                        }
                    })
            }
        }

})();