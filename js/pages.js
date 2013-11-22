/**
 * Объект для работы со страницами
 */
var pages = {

    /**
     * Существующие страницы
     */
    pages: [
        { name: 'top', title: 'популярные фотографии' },
        { name: 'recent', title: 'новые интересные фотографии' },
        { name: 'podhistory', title: 'фото дня' }
    ],

    /**
     * Обертка, в которой лежат ссылки на страницы
     */
    $pages: $('.pages'),

    /**
     * Инициализация обработчиков
     */
    init: function() {
        this.$pages.on('click', 'a', function () {
            var page = $(this).data('page');
            images.load(page);
        });
    },

    /**
     * Перерисовка ссылок на страницы
     * @param selectedPage имя выбранной страницы
     */
    redraw: function(selectedPage) {
        this.$pages.empty();

        for (var page in this.pages) {
            if (this.pages.hasOwnProperty(page) && this.pages[page].name !== selectedPage) {
                this.$pages.append(
                    $('<a/>', {
                        href: '#',
                        text: this.pages[page].title,
                        'class': 'link',
                        'data-page': this.pages[page].name
                    })
                );
            }
        }
    }
};