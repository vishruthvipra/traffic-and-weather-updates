/**
 * Created by vishruthkrishnaprasad on 1/3/17.
 */
(function () {
    angular
        .module('WebAppMaker')
        .directive('formsAppear', formsAppear);

    function formsAppear() {

        $("#traffic-label").on('click',function() {
            $('html, body').animate({
                'scrollTop' : $("#traffic").position().top
            });
        });

        $("#weather-label").on('click',function() {
            $('html, body').animate({
                'scrollTop' : $("#weather").position().top
            });
        });

        $("#contact-label").on('click',function() {
            $('html, body').animate({
                'scrollTop' : $("#contact").position().top
            });
        });

        var times = 0;
        // $(document).ready(function(e) {
        //     var $input = $('#refresh');
        //
        //     $input.val() == 'yes' ? location.reload(true) : $input.val('yes');
        // });

        // To make login form appear and blur the background
        if (times > 0)
        {
            location.reload(true);
        }
        else {
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

        // $(window).unload(function () { $(window).unbind('unload'); });
    }
})();


















