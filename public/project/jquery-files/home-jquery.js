/**
 * Created by vishruthkrishnaprasad on 1/3/17.
 */
(function () {
    angular
        .module('WebAppMaker')
        .directive('formsAppear', formsAppear);

    function formsAppear() {
        $("#drop-down").hide();
        // $("#gov-level-2").hide();
        $("#parking-level-2").hide();
        $("#ticketing-level-2").hide();
        $("#ticketing-level-3").hide();
        $("#traffic-level-2").hide();

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

        // $(document).on('click','#govt-services',function(){
        //     $("#gov-level-2").slideToggle("fast");
        // });

        $(document).on('click','#parking',function(){
            $("#parking-level-2").slideToggle("fast");
        });

        $(document).on('click','#ticketing',function() {
            $("#ticketing-level-2").slideToggle("fast");
        });

        /*$(document).on('click','#third-level',function() {
            $("#ticketing-level-3").slideToggle("fast");
        });

        $(document).on('click','#traffic-drop-down',function() {
            $("#traffic-level-2").slideToggle("fast");
        });*/


        $("#third-level").on('click',function() {
            $("#ticketing-level-3").slideToggle("fast");
        });

        $("#traffic-drop-down").on('click',function() {
            $("#traffic-level-2").slideToggle("fast");
        });
    }

    // $(window).unload(function () { $(window).unbind('unload'); });

})();


















