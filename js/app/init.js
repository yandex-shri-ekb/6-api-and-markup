'use strict';

require(['app/app', 'jquery'], function(App, $) {
    var app = new App();

    $(function() {
        app.init();
        app.loadImages('top', 1);
    });
});