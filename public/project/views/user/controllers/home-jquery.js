/**
 * Created by vishruthkrishnaprasad on 1/3/17.
 */
(function () {
    angular
        .module('WebAppMaker')
        .directive('formsAppear', formsAppear);

    window.onunload = function(){};


    function formsAppear() {

        // To make login form appear and blur the background
        $('#loginform').click(function () {
            $('.login').fadeToggle('slow');
            $('#main-container').addClass('blur-background');
        });

        $('fieldset').click(function () {
            $('#main-container').addClass('blur-background');
        });

        // To make register form appear and blur the background
        $('#registerform').click(function () {
            $('.register').fadeToggle('slow');
            $('#main-container').addClass('blur-background');
        });

        $(document).mouseup(function (e) {
            var container = $(".login");
            if (!container.is(e.target) && container.has(e.target).length == 0) {
                container.hide();
            }
        });

        $(document).mouseup(function (e) {
            var container = $(".register");
            if (!container.is(e.target) && container.has(e.target).length == 0) {
                container.hide();
                $('#main-container').removeClass('blur-background');
            }
        });
    }
})();


















