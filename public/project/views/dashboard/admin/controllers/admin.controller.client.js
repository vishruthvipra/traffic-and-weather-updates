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

        vm.editfields = false;
        vm.search = false;
        vm.addUser = false;

        vm.createUser = createUser;
        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
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
                        .error(function (err) {
                            vm.error = "Could not create user";
                        })
                });
        }

        function updateUser(oldUserId, updUser) {
            vm.editfields = false;
            var update = UserService
                .updateUser(oldUserId, updUser)
                .success(function (user) {
                    if (update !== null) {
                        vm.changeUser = false;
                        UserService.findAllUsers()
                            .success(function (user) {
                                vm.searchResults = user;
                                vm.search = false;
                            });
                    }
                })
                .error(function (err) {
                    vm.error = "Invalid userId";
                });
        }

        function deleteUser(delUser) {
            var update = UserService
                .deleteUser(delUser._id)
                .success(function (user) {
                    if (user !== null) {
                        vm.changeUser = false;
                        UserService.findAllUsers()
                            .success(function (user) {
                                vm.searchResults = user;
                            });
                    }
                })
                .error(function (err) {
                    vm.error = "Invalid userId";
                })
        }

        function startSearch(searchValue, searchText) {
            vm.search = true;
            vm.spinner = true;
            if (searchValue === 1) {
                var promise = UserService.findUserById(searchText);
                promise
                    .success(function (user) {
                        vm.searchResults = null;
                        vm.search = user;
                    })
                    .error(function (err) {
                        vm.error = "Incorrect userId";
                    });
            }
            else {
                var promise = UserService.findUserByUsername(searchText);
                promise
                    .success(function (user) {
                        vm.searchResults = null;
                        vm.search = user;
                    })
                    .error(function (err) {
                        vm.error = "Incorrect username";
                    });
            }
            vm.spinner = false;

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