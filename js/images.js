/**
 * Объект для работы с изображениями
 */
var images = {

    /**
     * Размер картинок
     */
    size: 'M',

    /**
     * Коллекция объектов загруженных картинок
     */
    images: {},

    /**
     * Получение коллекции загруженных картинок
     * @returns {}
     */
    getImages: function() {
        return this.images;
    },

    /**
     * Загрузка картинок на странице
     * @param page имя страницы
     */
    load: function(page) {
        var self = this;

        //установка статусов загрузки
        $('body').removeClass('loaded').addClass('load');

        $.getJSON('http://api-fotki.yandex.ru/api/' + page + '/?format=json&callback=?', function(data) {
            if (!data || data.entries.length === 0) {
                throw new Error('Произошла страшная трагическая ошибка');
            }

            //перерисовка страницы с картинками
            self.redraw(data.entries);

            //перерисовка ссылок на страницы
            pages.redraw(page);

            //установка заголовка
            document.title = 'Яндекс.Картинки: ' + data.title;
        });
    },

    /**
     * Рисование картинок на странице
     * @param entries
     */
    draw: function(entries) {
        var $images = $('<div/>');

        for (var i = 0, l = entries.length; i < l; i++) {
            $('<div/>', {
                'class': 'img-wrapper',
                'data-id': entries[i].id
            }).append(
                $('<img/>', {
                    src: entries[i].img[this.size].href,
                    alt: entries[i].title
                })
            ).append(
                $('<div/>', {
                    'class': 'img-subtitle',
                    text: entries[i].title
                }).append(
                    $('<div/>').append($('<a/>', {
                        href: 'http://fotki.yandex.ru/users/' + entries[i].author,
                        'class': 'author',
                        target: '_blank',
                        text: entries[i].author
                    }))
                )
            ).appendTo($images);

            //добавление изображений в коллекцию
            this.images[entries[i].id] = entries[i];
        }

        //вставка на страницу
        $('.content').append($images);

        //удаление статусов загрузки
        $('body').removeClass('load').addClass('loaded');
    },

    /**
     * Рисование картинок на странице с предварительной очисткой
     * @param entries
     */
    redraw: function(entries) {
        $('.content').empty();
        this.draw(entries);
    }
};