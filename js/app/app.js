define(['jquery', 'handlebars', 'app/image_preloader'], function($, Handlebars, ImagePreloader) {
    'use strict';

    /**
     * @export app/app
     * @class App
     */
    function App() {
        /**
         * @type {Object}
         */
        this.config = {
            'h':        150,
            'margin':   10
        };
    }

    /**
     * @param {App} app
     */
    function bindEvents(app) {
        app.$imageContainer.on('click', '.image', function() {
            var $image = $(this);
            selectImage(app, $image);
        });

        app.$preview.on('click', '.preview__arrow_prev', function() {
            var $btn = $(this),
                $image = app.$selectedImage.prevAll('.image').eq(0);

            selectImage(app, $image);
        });

        app.$preview.on('click', '.preview__arrow_next', function() {
            var $btn = $(this),
                $image = app.$selectedImage.nextAll('.image').eq(0);

            selectImage(app, $image);
        });
    }

    /* TODO
    *  при смене строки переносить превью
    *  находить самое высокое изображение в строке и делать превью такого размера и не менять потом
    */

    function selectImage(app, $image) {
        if(app.$selectedImage !== null && app.$selectedImage.get(0) == $image.get(0)) {
            return;
        }

        app.$selectedImage = $image;

        var $absFirstImage = app.$imageContainer.find('.image:first'),
            $absLastImage = app.$imageContainer.find('.image:last'),
            entry = $image.data('entry'),
            $firstImage = $image.hasClass('image_first') ? $image : $image.prevAll('.image_first').eq(0);

        console.assert($firstImage.length !== 0);

        $absFirstImage.get(0) == $image.get(0) ? app.$previewPrev.hide() : app.$previewPrev.show();
        $absLastImage.get(0) == $image.get(0) ? app.$previewNext.hide() : app.$previewNext.show();

        $firstImage.before(app.$preview);

        var $img = app.$preview
            .find('.preview__img')
                .css('width', entry.img.L.width)
                .css('height', entry.img.L.height)
            .find('img')
                .attr('src', entry.img.M.href)
                .css('width', entry.img.L.width)
                .css('height', entry.img.L.height);

        app._imagePreloader.preload(entry.img.L.href).then(function(imgSrc) {
            $img.attr('src', imgSrc);
        });

        app.$preview.show();
    }

    /**
     */
    App.prototype.init = function() {
        this.$body = $(document.body);
        this.$imageContainer = $('#images', this.$body);
        this._imageTemplate = $('#image-template', this.$body).html().trim();
        this.$preview = $('#preview', this.$body);
        this.$previewPrev = $('.preview__arrow_prev', this.$preview);
        this.$previewNext = $('.preview__arrow_next', this.$preview);

        this.$selectedImage = null;

        this._imagePreloader = new ImagePreloader();

        bindEvents(this);
    };

    /**
     * @param {string} type
     * @param {int} page
     */
    App.prototype.loadImages = function(type, page) {
        var app = this,
            url = 'http://api-fotki.yandex.ru/api/{0}/'.format(type);

        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: {
                format: 'json',
                limit: '20'
            }
        })
        .done(function(response) {
            var images = [];
            response.entries.forEach(function(entry) {
                var context = {
                    image: entry
                };

                var template = Handlebars.compile(app._imageTemplate),
                    html = template(context),
                    $image = $(html);

                images.push($image);
                $image
                    .appendTo(app.$imageContainer)
                    .data('entry', entry)
                ;
            });

            app.resizeImages(images);
        });
    };

    /**
     * @param {jQuery[]} images
     */
    App.prototype.resizeImages = function(images) {
        var app = this,
            containerW = app.$imageContainer.width(),
            row = [],
            rowW = 0,
            imageMargin = app.config['margin'],
            h = app.config['h'];

        images.forEach(function($image) {
            var originalW = $image.data('w'),
                originalH = $image.data('h'),
                scale = h / originalH,
                w = Math.ceil(scale * originalW);

            // resize image
            $image.find('img').css('height', h + 'px').css('width', w + 'px');
            $image.removeClass(['image_first', 'image_last']);

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

                        if(i === n - 1) {
                            $i.addClass('image_last');
                        }

                        if(i === 0) {
                            $i.addClass('image_first');
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

        if(row.length > 0) {
            row[0].addClass('image_first');
            row[row.length - 1].addClass('image_last');
        }
    };

    return App;
});