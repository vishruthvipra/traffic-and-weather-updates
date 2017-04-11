/**
 * Created by vishruthkrishnaprasad on 8/4/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("composeController", composeController)
    function composeController($routeParams, UserService) {
        vm = this;
        var userId = $routeParams["uid"];
        var senderId = $routeParams["sid"];
        vm.sendMessage = sendMessage;

        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function (user) {
                vm.user = user;
                console.log("do message sent notice and user not found notice!");
            });

            if(senderId !== "000") {
                UserService.findUserById(senderId)
                    .success(function (user) {
                    vm.to = user.username;
                });
            }
        }
        init();

        function sendMessage(message) {
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
                            })
                    })
            }



        }
    }
})();