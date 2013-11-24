'use strict';

require.config({
    shim: {
        underscore: {
            exports: '_'
        },
        backbone: {
            deps: [
                'underscore',
                'jquery'
            ],
            exports: 'Backbone'
        },
        marionette: {
            deps: [
                'underscore',
                'jquery',
                'backbone'
            ],
            exports: 'Marionette'
        },
        'backbone.wreqr': {
            deps: [
                'backbone'
            ]
        }
    },

    paths: {
        'jquery':                   './vendors/jquery/jquery',
        'underscore':               './vendors/underscore/underscore',
        'backbone':                 './vendors/backbone/backbone',
        'marionette':               './vendors/backbone/backbone.marionette',
        'backbone.wreqr':           './vendors/backbone/backbone.wreqr',
        'backbone.eventbinder':     './vendors/backbone/backbone.eventbinder',
        'backbone.babysitter':      './vendors/backbone/backbone.babysitter',
        'text':                     './vendors/require/require.text',
    }
});

require(['./app/app'], function (app) {
    app.start();
});
