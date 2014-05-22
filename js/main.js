require.config({
    paths: {
        jquery     : '//yandex.st/jquery/1.10.2/jquery.min',
        handlebars : '//cdnjs.cloudflare.com/ajax/libs/handlebars.js/1.1.2/handlebars.min',
        app        : 'app'
    },
    shim: {
        handlebars: {
            exports: 'Handlebars'
        }
    }
});

require(['app/init']);