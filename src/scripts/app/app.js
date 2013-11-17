define(function (require) {
    'use strict';

    var Backbone = require('backbone'),
        Marionette = require('marionette'),
        Bus = require('app/bus'),
        Router = require('app/router');

    var app = new Marionette.Application();

    app.addRegions({
        navigationRegion: '#navigation-region',
        mainRegion: '#main-region'
    });

    Bus.on('app:show:mainRegion', function (view) {
        app.mainRegion.show(view);
    });

    Bus.on('app:show:navigationRegion', function (view) {
        app.navigationRegion.show(view);
    });

    Router.start();

    app.on('initialize:after', function () {
        Backbone.history.start();
    });

    return app;
});
