requirejs.config({
    paths : {
        underscore : '//yandex.st/underscore/1.5.2/underscore-min',
        backbone : '//yandex.st/backbone/1.1.0/backbone-min',
        jquery : '//yandex.st/jquery/1.10.2/jquery.min',
        text : '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.10/text.min'
    },
    shim : {
        underscore : {
            exports : '_'
        },
        backbone : {
            deps : ['jquery', 'underscore'],
            exports : 'Backbone'
        }
    }
});

require([
    'backbone',
    'app'
], function(Backbone, App) {

    window.app = new App;

    Backbone.history.start();

});
