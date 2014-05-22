/**
 * Работа с Яндекс API.Фото. AJAX
 *
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 0.01
 * @copyright Artem Kuzvesov 2013
 *
 */
define(['jquery',
        'handlebars',
        'app/templateLoader'], function($, Handlebars, TemplateLoader) {

    /** @define {object} */
    var $preview = $('.preview'); // Элемент preview
    $preview.remove();
    /** @define {object} */
    var $miniatures = $('.miniatures');

    /** Расчитываем в шаблоне новую ширину изображения,
        учитывая, что высота всех миниатюр 150px*/
    Handlebars.registerHelper('newWith', function() {
        return newWith =  Math.ceil((arguments[0] * 150)/arguments[1]);
    });

    /**
    * Конструктор возвращаемого объекта
    * @constructor
    */
    App = function() {
        /** @define {object} */
        this.dataJson      = {}; // данные полученные с API для текущей категории
        /** @define {string} */
        this.photoCategory = 'top'; // категория, по умолчанию 'top'
        /** @define {number} */
        this.photoLimit    = 20; // количество подгружаемых миниатюр

        /** Обработка клика по пункту меню */
        $('ul.nav').on('click', 'li a', $.proxy(this.categoryChoice, this));

        /** Обработка клика "Больше фотографий" */
        $('.content').on('click', '.more', $.proxy(this.morePhotos, this));

        /** Обработка клика на миниатюру */
        $miniatures.on('click', 'li.miniature img', $.proxy(this.loadPreviw, this));
    }

    /**
     * Функция которая должна быть вызвана при запуске приложения
     */
    App.prototype.first = function() {
        this.ajaxCatalog();
    };

    /**
     * Загружаем фотографии через API, отрисовываем их и упорядочиаваем
     * @param  {[string]} photoCategory Категорию фотографий которую нужно загрузить
     */
    App.prototype.ajaxCatalog = function() {
        var app = this;

        $.ajax({
            url: '//api-fotki.yandex.ru/api/' + app.photoCategory +'/',
            type: 'GET',
            data: {
                    format : 'json',
                    limit : app.photoLimit
                },
            dataType: 'jsonp',
            beforeSend: function () {
                $('#loading').css('display', 'block');
                $('.more').show();
                $('.miniatures li').remove();
            },
            success: function (answer) {
                app.dataJson = answer;

                var $source        = $('#miniature-template').html().trim(),
                    template         = Handlebars.compile($source),
                    html             = template(answer), // собираем миниатюры по шаблону
                    countMiniature = app.dataJson.entries.length;

                $miniatures.append(html);
                if ((app.photoLimit > countMiniature) || (app.photoLimit === 100)) {
                    $('.more').hide();
                };
                $('#loading').hide();

                tidyImages();
            }
        });
    }

    /**
    * События, которые происходят при клике на категорию
    */
    App.prototype.categoryChoice = function(event) {
        var element = event.target, // текущий элемент в jQuery
            app     = this;

        $('a.active').removeClass('active');
        $(element).addClass('active');

        app.photoCategory = $(element).attr('id');
        app.photoLimit    = 20;
        app.ajaxCatalog(app.photoCategory, app.photoLimit);
    }

    /**
    * События, которые происходят при клике на "Больше фотографий"
    */
    App.prototype.morePhotos = function(event) {
        var element = event.target, // текущий элемент в jQuery
            app     = this;

        app.photoLimit += 20;
        if (app.photoLimit > 100) {
            app.photoLimit = 100;
        }
        app.ajaxCatalog(app.photoCategory, app.photoLimit);
    }

    /**
    * События, которые происходят при клике на миниатюру
    */
    App.prototype.loadPreviw = function(event) {
        var element         = event.target; // текущий элемент в jQuery

        this.miniature   = $(element).closest('li');
        this.renderPreview(this.miniature);
    }

    /**
    * Рендеринг превью
    */
    App.prototype.renderPreview = function(selected) {
        var app               = this,
            idPhoto          = selected.attr('id'),
            title             = app.dataJson.entries[idPhoto].title,
            $countMiniatures  = $('.miniatures li.miniature').length - 1;

        if ($('.selected')) $('li').removeClass('selected');
        if ($preview) $preview.remove();

        selected.addClass('selected');

        if (selected.hasClass("first")) {
            selected.before($preview).show();
        } else {
            selected.prevAll('.first:first').before($preview);
        }

        if ($('.preview ul li')) $('.preview ul li').remove();

        $('.prev, .next').show();

        if (idPhoto === '0') {
            $('.prev').hide();
            prev = true;
        }
        if (idPhoto === String($countMiniatures)) {
            $('.next').hide();
            next = true;
        }

        if (idPhoto) {
            $preview.find('img').attr({src: app.dataJson.entries[idPhoto].img.L.href, alt: title});
            $preview.find('h2').text(title);
            $preview.find('.author a').attr('href', 'http://fotki.yandex.ru/users/' + app.dataJson.entries[idPhoto].author).text(app.dataJson.entries[idPhoto].author);
            if (app.dataJson.entries[idPhoto].img.L.href) {
                $preview.find('ul').append('<li><a href="' + app.dataJson.entries[idPhoto].img.L.href + '" alt="' + title + '">' + app.dataJson.entries[idPhoto].img.L.width + 'x' + app.dataJson.entries[idPhoto].img.L.height + '</a></li>');
            }
            if (app.dataJson.entries[idPhoto].img.XL.href) {
                $preview.find('ul').append('<li><a href="' + app.dataJson.entries[idPhoto].img.XL.href + '" alt="' + title + '">' + app.dataJson.entries[idPhoto].img.XL.width + 'x' + app.dataJson.entries[idPhoto].img.XL.height + '</a></li>');
            }
            if (app.dataJson.entries[idPhoto].img.XXL.href) {
                $preview.find('ul').append('<li><a href="' + app.dataJson.entries[idPhoto].img.XXL.href + '" alt="' + title + '">' + app.dataJson.entries[idPhoto].img.XXL.width + 'x' + app.dataJson.entries[idPhoto].img.XXL.height + '</a></li>');
            }
            if (app.dataJson.entries[idPhoto].img.XXXL.href) {
                $preview.find('ul').append('<li><a href="' + app.dataJson.entries[idPhoto].img.XXXL.href + '" alt="' + title + '">' + app.dataJson.entries[idPhoto].img.XXXL.width + 'x' + app.dataJson.entries[idPhoto].img.XXXL.height + '</a></li>');
            }
        }

        $preview.slideDown(800);

        /** Обработка клика на кнопку закрыть */
        $preview.on('click', '.close', $.proxy(this.closePreview, this));

        /** Обработка клика на кнопку предыдущяя фотография */
        $preview.on('click', '.prev', $.proxy(this.prevPreview, this));

        /** Обработка клика на кнопку следующей фотография */
        $preview.on('click', '.next', $.proxy(this.nextPreview, this));


        document.onkeydown = NavigateThrough;
        function NavigateThrough (event) {
            switch (event.keyCode ? event.keyCode : event.which ? event.which : null) {
                case 37: // стрелка влево
                    if ($('.prev').css('display') !== 'none') {
                        app.prevPreview();
                    };
                    break;
                case 39: // стрелка впрво
                    if ($('.next').css('display') !== 'none') {
                        app.nextPreview();
                    };
                    break;
                case 27: // esc
                    app.closePreview();
                    break;
            }
        }
    }

    /**
    * События, которые происходят при клике на кнопку закрыть
    */
    App.prototype.closePreview = function() {
        $('.preview').slideUp(800, function() {
            $(this).remove();
        });
        $('.selected').removeClass('selected')
    }

    /**
    * События, которые происходят при клике на кнопку предыдущяя фотография
    */
    App.prototype.prevPreview = function() {
        this.miniature = this.miniature.prev();

        if (this.miniature.hasClass('preview')) {
            this.miniature = this.miniature.prev();
        }

        this.renderPreview(this.miniature);
    }

    /**
    * События, которые происходят при клике на кнопку следующей фотография
    */
    App.prototype.nextPreview = function() {
        this.miniature = this.miniature.next();
        this.renderPreview(this.miniature);
    }

    /**
    * Упорядочивание изображений
    */
    function tidyImages() {
        var $widthBlock = $miniatures.width(), // ширина области с миниатюрами
            withLine    = 0, // ширина получаемой строки миниатюр
            first       = true, // текущий элемент является первым в строке
            $countMin   = $('.miniature').length - 1, // количество миниатюр
            countLine   = '', // количество миниатюр в строке
            lineMin     = [], // массив миниатюр в строке
            $widthImage = '', // ширина миниатюры
            difference  = '', // разница между шириной строки и шириной всех выбранных минитаюр
            newWith     = ''; // знаение ширины миниатюры, на которое надо изменить

            /**
            * @constructor
            * @param  {object} element миниатюра
            * @param  {number} width   ширина миниатюры
            */
            function minimage(image, widthImg){
                this.image    = image;
                this.widthImg = Number(widthImg);
            };

        $('.miniature').each(function(index, element) {
            $(this).removeClass('first').removeClass('last').css('float', 'none');

            if(index === 0) {
                $(this).addClass('firsted');
            }

            $widthImage = $('img', this).width(); // ширина миниатюры

            withLine += $widthImage + 20;

            difference = $widthBlock - withLine;

            if (first) {
                $(this).addClass('first');
                first = false;
            };

            lineMin.push(new minimage(element, $widthImage));

            if (difference < 0) {
                countLine  = lineMin.length;
                difference = (-1 * difference) + 40;
                newWith = Math.ceil(difference / countLine);

                lineMin.forEach(function(el) {
                    $(el.image).css('width', el.widthImg - newWith + 'px');
                });

                $(this).addClass('last').css({float: 'right', width: $widthImage - newWith - countLine + 'px'});
                first = true;
                withLine = 0;
                lineMin = [];
            };

            if (index === $countMin) {
                $(this).addClass('last').addClass('lasted').css('float', 'none');
            };

        });
    }

    /**
     * Отслеживаем изменения размера браузера
     */
    $(function() {
        $(window).resize(tidyImages);
    });

    return App;
});
