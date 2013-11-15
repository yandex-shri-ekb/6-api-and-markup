'use strict';

define(['jquery', 'handlebars'], function($, Handlebars) {
    /**
     * @class App
     */
    var App = function() {

    };

    App.prototype.start = function() {
        var $body = $(document.body),
            $images = $('#images', $body),
            $imageTemplate = $('#images-template', $body);

        var url = 'http://api-fotki.yandex.ru/api/{0}/?format=json'.format('top');
        $.ajax({
            url: url,
            dataType: 'jsonp'
        })
        .done(function(response) {
            var context = {
                images: response.entries
            };

            console.log(context);

            var source   = $imageTemplate.html(),
                template = Handlebars.compile(source),
                html     = template(context);

            $images.html(html);
        });
    }

    return App;
});