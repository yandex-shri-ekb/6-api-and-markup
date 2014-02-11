/**
* Объект для работы с предпросмотром картинки
*/
var preview = {

    /**
     * Герерация шаблона для предпросмотра картинки
     * @param image объект картинки, возвращаемый API
     * @returns {*|jQuery}
     */
    create: function(image) {
        //
        var $preview = $('.img-preview-template').clone().removeClass('img-preview-template').addClass('img-preview');

        //todo: нужно проверять, что пришло в image

        //картинка
        $preview.find('.slideshow .slide-image').html(
            $('<img/>', { src: image.img['L'].href })
        );

        //заголовк
        $preview.find('.img-title').text(image.title);

        //автор
        $preview.find('.author-wrapper').append(
            $('<a/>', {
                href: 'http://fotki.yandex.ru/users/' + image.author,
                target: '_blank',
                'class': 'author',
                text: image.author
            })
        );

        //разрешения
        for (var size in image.img) {
            //картинки нужны большие, не меньше 300px в ширину
            if (image.img[size].width > 300) {
                $('<li/>').append($('<a/>', {
                    href: image.img[size].href,
                    target: '_blank',
                    text: image.img[size].width + 'x' + image.img[size].height
                })).appendTo($preview.find('.resolutions'));
            }
        }

        return $preview;
    },

    /**
     * Определение местоположения превью и его открытие
     * @param $wrapper обертка картинки, которую надо открыть
     * @param speed скорость анимаций
     */
    show: function($wrapper ,speed) {
        var self = this;
        //объект загруженных картинок
        var loadedImages = images.getImages();
        //ид выбраной картинки
        var id = $wrapper.data('id');
        //объект выбранной картинки
        var image = loadedImages[id];
         //смещение картинки от левого края
        var offsetLeft = $wrapper.offset().left;
        //создание превью
        var $preview = preview.create(image);

        //выделить обертку, по которой было нажатие
        $wrapper.addClass('selected');

        //нахождение крайней левой картинки
        while (offsetLeft > 200) {
            $wrapper = $wrapper.prev('.img-wrapper');
            offsetLeft = $wrapper[0].offsetLeft;
        }

        //вставка предпросмотра перед крайней левой картинкой
        $wrapper.before($preview.animate({ height: 450 }, speed));

        //скролл на предпросмотр
        $(document.body).animate({ scrollTop: $preview.offset().top - 100 }, 500);
    },

    /**
     * Скрытие предпросмотра
     * @param speed скорость анимации
     * @param callback вызывается по окончанию анимации
     */
    hide: function(speed, callback) {
        var $preview = $('.img-preview');
        $('.img-wrapper').removeClass('selected');

        //если предпросмотр закрыт - просто выполняется колбэк
        if (!this.isOpen()) {
            callback();
        }
        else {
            $preview.animate({ height: 0 }, speed, function () {
                callback();
            });
        }
    },

    /**
     * Удаление предпросмотра из DOM
     *
     */
    remove: function() {
        $('.img-preview').remove();
    },

    /**
     * Открыт ли предпросмотр
     * @returns {boolean}
     */
    isOpen: function() {
        return ($('.img-preview').length ==! 0);
    },

    /**
     * Выбор соседнего изображения
     * @param direct направление('left'|'right')
     */
    changeImage: function(direct) {
        var self = this;
        //обертка картинки, которую нужно открыть
        var $wrapper;
        //выбраная картинка
        var $selected = $('.content').find('.selected');
        //скрытие здесь происходит мнгновенно
        var speed = 0;

        this.hide(speed, function () {
            self.remove();

            //ищем следущую или предыдущую картинку
            if (direct === 'left') $wrapper = $selected.prev('.img-wrapper');
            else $wrapper = $selected.next('.img-wrapper');

            //картинок больше нет - показывать нечего
            if ($wrapper.length === 0) return;

            self.show($wrapper, speed);
        });
    }
};