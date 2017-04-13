/**
 * Created by vishruthkrishnaprasad on 7/2/17.
 */
(function() {
    angular
        .module("WebAppMaker")
        .config(Config);

    var checkLoggedIn = function($q, $timeout, $http, $location, $rootScope) {
        return $http.get('/api/loggedin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
            } else{
                $location.url('/home');
            }
        });
    };

    var checkAdmin = function($q, $timeout, $http, $location, $rootScope) {
        return $http.get('/api/useradmin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
            } else{
                $location.url('/dashboard');
            }
        });
    };

    var checkTAdmin = function($q, $timeout, $http, $location, $rootScope) {
        return $http.get('/api/usertadmin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
            } else{
                $location.url('/dashboard');
            }
        });
    };

    var checkWAdmin = function($q, $timeout, $http, $location, $rootScope) {
        return $http.get('/api/userwadmin').success(function(user) {
            $rootScope.errorMessage = null;
            if (user !== '0') {
                $rootScope.currentUser = user;
            } else{
                $location.url('/dashboard');
            }
        });
    };

    function Config($routeProvider, $httpProvider) {

        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/json;charset=utf-8';

        $routeProvider
            .when("/home", {
                templateUrl: "views/user/templates/home.view.client.html",
                controller: "HomeController",
                controllerAs: "model"
            })
            .when("/dashboard", {
                templateUrl: "views/user/templates/dashboard.view.client.html",
                controller: "DashboardController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/profile", {
                templateUrl: "views/user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/weather", {
                templateUrl: "views/weather/templates/weather.view.client.html",
                controller: "WeatherController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/traffic", {
                templateUrl: "views/traffic/templates/traffic.view.client.html",
                controller: "TrafficController",
                controllerAs: "model",
                resolve: { loggedin: checkLoggedIn }
            })
            .when("/weather_domain", {
                templateUrl: "views/dashboard/weather.domain/templates/weather.domain.view.client.html",
                controller: "weatherDomainController",
                controllerAs: "model",
                resolve: { loggedin: checkWAdmin }
            })
            .when("/traffic_domain", {
                templateUrl: "views/dashboard/traffic.domain/templates/traffic.domain.view.client.html",
                controller: "trafficDomainController",
                controllerAs: "model",
                resolve: {loggedin: checkTAdmin }
            })
            .when("/admin", {
                templateUrl: "views/dashboard/admin/templates/admin.view.client.html",
                controller: "adminController",
                controllerAs: "model",
                resolve: {loggedin: checkAdmin }
            })
            .when("/inbox", {
                templateUrl: "views/dashboard/email/templates/inbox.view.client.html",
                controller: "inboxController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn }
            })
            .when("/compose/:sid", {
                templateUrl: "views/dashboard/email/templates/compose.view.client.html",
                controller: "composeController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn }
            })
            .when("/city", {
                templateUrl: "views/dashboard/city/templates/city.view.client.html",
                controller: "cityController",
                controllerAs: "model",
                resolve: {loggedin: checkLoggedIn }
            })
            .otherwise({
                templateUrl: "views/user/templates/home.view.client.html"
            });
    }
})();