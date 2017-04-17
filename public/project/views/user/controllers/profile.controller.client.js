/**
 * Created by vishruthkrishnaprasad on 12/2/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("ProfileController", profileController)
        function profileController($rootScope, UserService, $location, loggedin) {
            var vm = this;
            vm.user = loggedin.data;
            var user = vm.user;
            var userId = user._id;

            vm.updateUser = updateUser;
            vm.deleteUser = deleteUser;

            function init() {

            }

            init();

            function updateUser(newUser) {
                var update = UserService
                    .updateUser(userId, newUser)
                    .success(function (user) {
                        if(update !== null)
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
                        if (user !== null) {
                            UserService
                                .logout()
                                .then(function (response) {
                                    $rootScope.currentUser = null;
                                    $location.url("/home");
                                });
                        }
                        else {
                            vm.error = "Could not delete user";
                        }
                    })
            }
        }

})();