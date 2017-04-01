/**
 * Created by vishruthkrishnaprasad on 7/2/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .config(Config);

    function Config($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/home", {
                templateUrl: "views/user/templates/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/user/:uid", {
                templateUrl: "views/user/templates/dashboard.view.client.html",
                controller: "DashboardController",
                controllerAs: "model"
            })
            .when("/user/:uid/profile", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model"
            })
            .when("/user/:uid/weather", {
                templateUrl: "views/weather/templates/weather.view.client.html",
                controller: "WeatherController",
                controllerAs: "model"
            })
            .when("/user/:uid/traffic", {
                templateUrl: "views/traffic/templates/traffic.view.client.html",
                controller: "TrafficController",
                controllerAs: "model"
            })
            .when("/user/:uid/weather_domain", {
                templateUrl: "views/weather.domain/templates/weather.domain.view.client.html",
                controller: "weatherDomainController",
                controllerAs: "model"
            })

    }
})();