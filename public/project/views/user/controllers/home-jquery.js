/**
 * Created by vishruthkrishnaprasad on 1/3/17.
 */
(function () {
    angular
        .module('WebAppMaker')
        .directive('formsAppear', formsAppear);

    function formsAppear() {
        $("#drop-down").hide();
        $(".gov-level-2").hide();

        $(".traffic-label").on('click',function() {
            $('html, body').animate({
                'scrollTop' : $("#traffic").position().top
            });
        });

        $(".weather-label").on('click',function() {
            $('html, body').animate({
                'scrollTop' : $("#weather").position().top
            });
        });

        $(".contact-label").on('click',function() {
            $('html, body').animate({
                'scrollTop' : $("#contact").position().top
            });
        });

        $('.loginform').click(function () {

            $('.login').fadeToggle('slow');
            $('#main-container').addClass('blur-background');
        });

        $('fieldset').click(function () {
            $('#main-container').addClass('blur-background');
        });

        // To make register form appear and blur the background
        $('.registerform').click(function () {
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

        $(".arrow-down").on('click',function() {
            $("#drop-down").toggle("fast");
        });

        $("#govt-services").on('click',function() {
            $(".gov-level-2").slideToggle("fast");
        });
    }

    // $(window).unload(function () { $(window).unbind('unload'); });

})();


















