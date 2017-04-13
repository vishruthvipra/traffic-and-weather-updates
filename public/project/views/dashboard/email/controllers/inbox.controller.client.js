/**
 * Created by vishruthkrishnaprasad on 8/4/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("inboxController", inboxController)
    function inboxController($rootScope, $location, UserService, loggedin, $location) {
        vm = this;
        vm.user = loggedin.data;
        var user = vm.user;
        var userId = user._id;
        vm.deleteMessage = deleteMessage;
        vm.reply = reply;
        vm.logout = logout;

        function init() {
            vm.messages = user.messages;
            for (var i in user.messages) {
                vm.messages[i].dateOfMessage = new Date(user.messages[i].dateOfMessage).toLocaleString();
            }
        }
        init();

        function deleteMessage(messageId) {
            UserService
                .deleteMessage(userId, messageId)
                .success(function (message) {
                    vm.success = "Message successfully deleted!";
                    init();
                })
                .error(function (err) {
                    vm.error = "Message not deleted...";
                })
        }

        function reply(senderId) {
            $location.url("/compose/" + senderId);
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