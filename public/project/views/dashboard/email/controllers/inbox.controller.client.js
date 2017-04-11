/**
 * Created by vishruthkrishnaprasad on 8/4/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("inboxController", inboxController)
    function inboxController($routeParams, $location, UserService) {
        vm = this;
        var userId = $routeParams["uid"];
        vm.deleteMessage = deleteMessage;
        vm.reply = reply;
        function init() {
            var promise = UserService.findUserById(userId);
            promise.success(function (user) {
                vm.user = user;
                vm.messages = user.messages;
                for (var i in user.messages) {
                    vm.messages[i].dateOfMessage = new Date(user.messages[i].dateOfMessage).toLocaleString();
                }
            });
        }
        init();

        function deleteMessage(messageId) {
            UserService
                .deleteMessage(userId, messageId)
                .success(function (message) {
                    init();
                })
        }

        function reply(senderId) {
            $location.url("/user/" + vm.user._id + "/compose/" + senderId);
        }
    }
})();