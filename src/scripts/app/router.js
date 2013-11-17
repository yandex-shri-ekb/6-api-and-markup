define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        MainController = require('./controllers/main_controller');

    var Router = Marionette.AppRouter.extend({
        appRoutes: {
            'show/:type': 'show',
            '*other': 'redirect'
        }
    });

    return {
        start: function () {
            MainController.start();
            return new Router({
                controller: MainController
            });
        }
    };
});
