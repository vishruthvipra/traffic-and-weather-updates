/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", profileController)
        function profileController($routeParams, UserService, $location, $route, $timeout) {
            var vm = this;
            var userId = $routeParams["uid"];
            vm.back = back;

            function init() {
                var promise = UserService.findUserById(userId);
                promise.success(function (user) {
                    vm.user = user;
                });
            }

            init();
            vm.updateUser = updateUser;
            vm.deleteUser = deleteUser;

            function back() {
                // $timeout(function(){$route.reload();},1000);
                $location.url("/user/"+vm.user._id);
            }

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
                    .deleteUser(userId, user)
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