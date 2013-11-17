'use strict';

define(['jquery', 'handlebars'], function($, Handlebars) {
    /**
     * @class App
     */
    var App = function() {
        /** @type {Object} */
        this.config = {
            'h': 150,
            'margin': 10
        };
    };

    /**
     */
    App.prototype.init = function() {
        this.$body = $(document.body);
        this.$imageContainer = $('#images', this.$body);
        this.$imageTemplate = $('#images-template', this.$body);
    }

    /**
     * @param {string} type
     * @param {int} page
     */
    App.prototype.loadImages = function(type, page) {
        var app = this,
            url = 'http://api-fotki.yandex.ru/api/{0}/?format=json'.format(type);

        $.ajax({
            url: url,
            dataType: 'jsonp'
        })
        .done(function(response) {
            var context = {
                images: response.entries
            };

            console.log(response.entries);

            var source = app.$imageTemplate.html(),
                template = Handlebars.compile(source),
                html = template(context),
                containerW = app.$imageContainer.width();

            app.$imageContainer.html(html);

            app.resizeImages();
        });
    }

    /**
     */
    App.prototype.resizeImages = function() {
        var app = this,
            containerW = app.$imageContainer.width(),
            $images = app.$imageContainer.find('.image'),
            row = [],
            rowW = 0,
            imageMargin = app.config['margin'],
            h = app.config['h'];

        $images.each(function() {
            var $image = $(this),
                originalW = $image.data('w'),
                originalH = $image.data('h'),
                ratio = originalW / originalH,
                scale = h / originalH,
                w = Math.ceil(scale * originalW);

            // resize image
            $image.find('img').css('height', h + 'px').css('width', w + 'px');

            rowW += w + imageMargin;
            row.push($image);

            if(rowW >= containerW) {
                var overW = rowW - containerW,
                    n = row.length,
                    imageOverW = Math.ceil(overW / n);

                if(overW > 0) {
                    for(var i = 0; i < n; i++) {
                        var $i = row[i],
                            iW = $i.css('width').replace(/[^-\d\.]/g, '');

                        $('img', $i).css('margin-left', -Math.floor(imageOverW / 2) + 'px');

                        if(overW > imageOverW) {
                            $i.css('width', iW - imageOverW + 'px');
                            overW -= imageOverW;
                        }
                        else {
                            $i.css('width', iW - overW + 'px');
                        }

                        if(overW === 0) {
                            break;
                        }

                        console.assert(overW > 0);
                    }
                }

                rowW = 0;
                row = [];
            }
        });
    }

    return App;
});