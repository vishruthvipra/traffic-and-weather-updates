/**
 * Created by vishruthkrishnaprasad on 8/4/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("composeController", composeController)
    function composeController($routeParams, UserService, loggedin, $location) {
        vm = this;
        vm.user = loggedin.data;
        var user = vm.user;
        var userId = user._id;
        var senderId = $routeParams["sid"];
        vm.sendMessage = sendMessage;
        vm.logout = logout;
        vm.to = null;
        vm.message = {subject: "", body: null} ;

        function init() {
            vm.user = user;
            if(senderId !== "000") {
                UserService.findUserById(senderId)
                    .success(function (user) {
                        vm.to = user.username;
                    });
            }
        }
        init();

        function sendMessage(message) {
            if (!vm.to) {
                vm.error = "Username cannot be blank";
            }
            else if (!vm.message.body) {
                vm.error = "No message composed";
            }
            else {
                var sendTo = vm.to.split(/[\s,]+/);
                vm.message.domain = vm.user.role;
                vm.message.body = message.body;
                vm.message.subject = message.subject;
                vm.message.dateOfMessage = new Date().toISOString();
                vm.message.senderId = userId;
                vm.message.username = vm.user.username;

                for (var i in sendTo) {
                    UserService.findUserByUsername(sendTo[i])
                        .success(function (user) {
                            UserService.addMessage(user._id, vm.message)
                                .success(function (user) {
                                    vm.error = null;
                                    vm.success = "Message sent successfully!";
                                })
                        })
                        .error(function (err) {
                            vm.error = "Could not send message";
                        })
                }

            }

        }

        function logout() {
            UserService
                .logout()
                .then(function (response) {
                    $location.url("/home");
                });
        }
    }
})();
