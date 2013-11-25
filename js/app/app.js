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
            'margin':   10,
            'limit':    20
        };
    }

    /**
     * @param {App} app
     */
    function bindEvents(app) {
        // select image
        app.$imageContainer.on('click', '.image', function() {
            var $image = $(this);
            selectImage(app, $image);
        });

        // prev
        app.$preview.on('click', '.preview__arrow_prev', $.proxy(previewPrev, app));

        // next
        app.$preview.on('click', '.preview__arrow_next', $.proxy(previewNext, app));

        // close
        app.$previewClose.on('click', $.proxy(previewClose, app));

        app.$body.keyup(function( event ) {
            if(app.$selectedImage === null) {
                return;
            }

            switch(event.which) {
                case 39: // right arrow
                    $.proxy(previewNext, app)();
                    event.preventDefault();
                    break;
                case 37: // left arrow
                    $.proxy(previewPrev, app)();
                    event.preventDefault();
                    break;
                case 27: // esc
                    $.proxy(previewClose, app)();
                    event.preventDefault();
                    break;
            }
        });

        // show more
        app.$more.on('click', function() {
            app.loadMore();
        });

        // window resize
        var resizeTimer = null;
        app.$window.on('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                app.resizeImages();
            }, 80);
        });

        // switch
        app.$switchDay.add(app.$switchTop).add(app.$switchInteresting).on('click', function() {
            var $link = $(this);
            if($link.hasClass('active')) {
                return false;
            }

            $link.parent().children().removeClass('active');
            $link.addClass('active');

            switch($link.attr('id')) {
                case 'switch-top':
                    app.start('top');
                    break;
                case 'switch-day':
                    app.start('podhistory');
                    break;
                case 'switch-interesting':
                    app.start('recent');
                    break;
                default:
                    throw new Error('application error');
                    break;
            }

            return false;
        });
    }

    /**
     * TODO находить самое высокое изображение в строке и делать превью такого размера и не менять потом
     *
     * @param {App} app
     * @param {jQuery} $image
     */
    function selectImage(app, $image) {
        // уже выбрано тоже самое изображение
        if(app.$selectedImage !== null && app.$selectedImage.get(0) == $image.get(0)) {
            return;
        }

        if(app.$selectedImage !== null) {
            app.$selectedImage.removeClass('image_selected');
        }

        $image.addClass('image_selected');
        app.$selectedImage = $image;

        var $absFirstImage = app.$imageContainer.find('.image:first'),
            $absLastImage = app.$imageContainer.find('.image:last'),
            entry = $image.data('entry'),
            $firstImage = $image.hasClass('image_first') ? $image : $image.prevAll('.image_first').eq(0);

        console.assert($firstImage.length !== 0);

        // проверка на первое и последнее изображение
        $absFirstImage.get(0) == $image.get(0) ? app.$previewPrev.addClass('preview__arrow_disabled') : app.$previewPrev.removeClass('preview__arrow_disabled');
        $absLastImage.get(0) == $image.get(0) ? app.$previewNext.addClass('preview__arrow_disabled') : app.$previewNext.removeClass('preview__arrow_disabled');

        // перед первым изображением в строке
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
    function previewNext() {
        var app = this,
            $btn = app.$previewNext,
            $image = app.$selectedImage.nextAll('.image').eq(0);

        if($btn.hasClass('preview__arrow_disabled')) {
            return;
        }

        selectImage(app, $image);
    }

    /**
     */
    function previewPrev() {
        var app = this,
            $btn = app.$previewPrev,
            $image = app.$selectedImage.prevAll('.image').eq(0);

        if($btn.hasClass('preview__arrow_disabled')) {
            return;
        }

        selectImage(app, $image);
    }

    /**
     */
    function previewClose() {
        var app = this;

        app.$preview.hide();
        app.$selectedImage.removeClass('image_selected');
        app.$selectedImage = null;
    }

    /**
     */
    App.prototype.init = function() {
        this.$window = $(window);
        this.$body = $(document.body);
        this.$imageContainer = $('#images', this.$body);
        this.$preview = $('#preview', this.$body);
        this.$previewPrev = $('.preview__arrow_prev', this.$preview);
        this.$previewNext = $('.preview__arrow_next', this.$preview);
        this.$previewClose = $('.preview__close', this.$preview);
        this.$more = $('#images-more', this.$body);

        this.$selectedImage = null;

        var thtml = $('#image-template', this.$body).html().trim();
        this._imageTemplate = Handlebars.compile(thtml);

        this._imagePreloader = new ImagePreloader();
        this._nextPageUrl = null;

        this.$switchTop = $('#switch-top', this.$body);
        this.$switchDay = $('#switch-day', this.$body);
        this.$switchInteresting = $('#switch-interesting', this.$body);

        bindEvents(this);
    };

    /**
     * @param {string} type top|interesting|day
     */
    App.prototype.start = function(type) {
        var app = this,
            url = 'http://api-fotki.yandex.ru/api/{0}/'.format(type);

        app._nextPageUrl = null;
        // hide preview
        app.$preview.hide();

        // remove images
        app.$imageContainer.find('.image').remove();

        app.$more.removeClass('images-more_disabled');

        app.loadImages(url);
    };

    /**
     */
    App.prototype.loadMore = function() {
        var app = this;

        if(app._nextPageUrl) {
            app.loadImages(app._nextPageUrl);
        }
    };

    /**
     * @param {string} url
     */
    App.prototype.loadImages = function(url) {
        var app = this;

        $.ajax({
            url: url,
            dataType: 'jsonp',
            data: {
                format: 'json',
                limit: app.config.limit
            }
        })
        .done(function(response) {
            response.entries.forEach(function(entry) {
                var context = {
                    image: entry
                };

                var html = app._imageTemplate(context),
                    $image = $(html);

                $image
                    .appendTo(app.$imageContainer)
                    .data('entry', entry)
                ;
            });

            app.resizeImages();
            app._nextPageUrl = response.links.next || null;
            if(app._nextPageUrl === null) {
                app.$more.addClass('images-more_disabled');
            }
        });
    };

    /**
     */
    App.prototype.resizeImages = function() {
        var app = this,
            containerW = app.$imageContainer.width(),
            row = [],
            rowW = 0,
            imageMargin = app.config['margin'],
            h = app.config['h'],
            images = app.$imageContainer.find('.image');

        images.each(function() {
            var $image = $(this),
                entry = $image.data('entry'),
                originalW = entry.img.M.width,
                originalH = entry.img.M.height,
                scale = h / originalH,
                w = Math.ceil(scale * originalW);

            // resize image
            $image.find('.image__img')
                .css('height', h + 'px')
                .css('width', w + 'px')
                .css('margin-left', 0);

            $image.removeClass('image_first image_last');
            $image.css('width', 'auto');

            if(row.length !== 0) {
                rowW += w + imageMargin
            }
            else {
                rowW += w
            }

            row.push($image);

            // строка шире контейнера
            if(rowW >= containerW) {
                var overW = rowW - containerW,
                    n = row.length,
                    imageOverW = Math.ceil(overW / n);

                if(overW > 0) {
                    for(var i = 0; i < n; i++) {
                        var $i = row[i],
                            iW = $i.css('width').replace(/[^-\d\.]/g, '');

                        // отцентрируем картинку
                        $('.image__img', $i).css('margin-left', -Math.floor(imageOverW / 2) + 'px');

                        if(overW > imageOverW) {
                            $i.css('width', iW - imageOverW + 'px');
                            overW -= imageOverW;
                        }
                        else {
                            $i.css('width', iW - overW + 'px');
                            overW = 0;
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