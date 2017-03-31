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
            .when("/user/:uid/website", {
                templateUrl: "views/website/templates/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/new", {
                templateUrl: "project/views/website/templates/website-new.view.client.html",
                controller: "WebsiteNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid", {
                templateUrl: "project/views/website/templates/website-edit.view.client.html",
                controller: "WebsiteEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page", {
                templateUrl: "project/views/page/templates/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/new", {
                templateUrl: "project/views/page/templates/page-new.view.client.html",
                controller: "PageNewController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid", {
                templateUrl: "project/views/page/templates/page-edit.view.client.html",
                controller: "PageEditController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget", {
                templateUrl: "project/views/widget/templates/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/new", {
                templateUrl: "project/views/widget/templates/widget-choose.view.client.html",
                controller: "WidgetChooseController",
                controllerAs: "model"
            })
            .when("/user/:uid/website/:wid/page/:pid/widget/:wgid", {
                templateUrl: "project/views/widget/templates/widget-edit.view.client.html",
                controller: "WidgetEditController",
                controllerAs: "model"
            })
    }
})();