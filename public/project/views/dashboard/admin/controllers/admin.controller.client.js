/**
 * Created by vishruthkrishnaprasad on 7/4/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("adminController", adminController)
    function adminController($rootScope, UserService, loggedin, $location) {
        var vm = this;
        vm.user = loggedin.data;
        var user = vm.user;
        var userId = user._id;
        vm.search = false;
        vm.u = true;
        vm.addUser = false, vm.changeUser = false;
        vm.createUser = createUser;
        vm.changedUser = changedUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.editfields = false;
        vm.modelClicked = modelClicked;
        vm.startSearch = startSearch;
        vm.logout = logout;

        function init() {
            var promise = UserService.findAllUsers();
            promise
                .success(function (user) {
                    vm.searchResults = user;
                });
        }

        init();

        function changedUser(chgUser) {
            vm.addUser = false;
            if (vm.opUser === 1) {
                updateUser(chgUser);
            }
            else {
                deleteUser(chgUser);
            }
        }

        function createUser(newUser) {
            vm.changeUser = false;
            UserService
                .findUserByUsername(newUser.username)
                .success(function (user) {
                    vm.error = "User already exists";
                })
                .error(function (err) {
                    UserService
                        .register(newUser)
                        .success(function (user) {
                            vm.add = false;
                            UserService.findAllUsers()
                                .success(function (user) {
                                    vm.searchResults = user;
                                });
                        })
                });
        }

        function updateUser(updUser) {
            vm.editfields = false;
            console.log(updUser);
            // var update = UserService
            //     .updateUser(updUser._id, updUser)
            //     .success(function (user) {
            //         if (update != null) {
            //             vm.changeUser = false;
            //             UserService.findAllUsers()
            //                 .success(function (user) {
            //                     vm.searchResults = user;
            //                 });
            //         }
            //         else {
            //             vm.error = "Unable to update..."
            //         }
            //     });
        }

        function deleteUser(delUser) {
            var update = UserService
                .deleteUser(delUser._id)
                .success(function (user) {
                    if (user != null) {
                        vm.changeUser = false;
                        UserService.findAllUsers()
                            .success(function (user) {
                                vm.searchResults = user;
                            });
                    }
                    else {
                        vm.error = "Could not delete user";
                    }
                })
        }

        function modelClicked() {
            vm.search = false;
            vm.addUser = false;
            vm.changeUser = false;
            vm.u = true;

            var promise = UserService.findAllUsers();
            promise
                .success(function (user) {
                    vm.searchResults = user;
                });
        }

        function startSearch(searchValue, searchText) {
            vm.search = true;
            vm.searchResults = false;
            if (searchValue === 1) {
                var promise = UserService.findUserById(searchText);
                promise
                    .success(function (user) {
                        vm.searchResults = null;
                        vm.search = user;
                    });
            }
            else {
                var promise = UserService.findUserByUsername(searchText);
                promise
                    .success(function (user) {
                        vm.searchResults = null;
                        vm.search = user;
                    });
            }

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