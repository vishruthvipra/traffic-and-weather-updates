/**
 * Created by vishruthkrishnaprasad on 10/4/17.
 */
(function () {
    angular
        .module("WebAppMaker")
        .controller("cityController", cityController)
    function cityController(wikiService, $rootScope, $location) {
        vm = this;
        vm.logout = logout;

        function init() {
            // wikiService.get()
            //     .then(function(data) {
            //         vm.pageDetails = data.data.query.pages;
            //         // var parser = new DOMParser();
            //         // var doc = parser.parseFromString(pageDetails, "text/html");
            //         // vm.docu = doc.body.firstChild;
            //
            //         vm.wikiData = data.data;
            //     });
        }
        init();

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