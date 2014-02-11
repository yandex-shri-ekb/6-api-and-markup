$(function() {
    //стартовая страница
    var startPage = pages.pages[0].name;

    //инициализация страниц
    pages.init();
    //перерисовать страницы
    pages.redraw(startPage);
    //загрузить фотографии текущей страницы
    images.load(startPage);

    //клик по картинке
    $('.content').on('click', 'img',function () {
        //обертка картинки, по которой кликнули
        var $wrapper = $(this).closest('.img-wrapper');
        //выбрана ли картинка
        var selected = $wrapper.hasClass('selected');
        //скорость анимаций
        var speed = (preview.isOpen() && !selected) ? 0 : 500;

        //во всех случаях превью сначала полностью удаляется
        preview.hide(speed, function () {

            preview.remove();

           //если клик по выбраной картинке
            if (selected) {
                //остается просто снять с нее выделение
                $wrapper.removeClass('selected');
            }
            else {
                //иначе создаем предпросмотр заново и добавляем его на страницу
                preview.show($wrapper, speed);
            }
        });

    //крест в предпросмотре
    }).on('click', '.close',function () {
        preview.hide(500, function () {
            preview.remove();
        });

    //стрелки в предпросмотре
    }).on('click', '.arrow', function (e) {
        var direct = $(this).data('direct');
        preview.changeImage(direct);
    });

    //нажатие кнопок клавиатуры
    $(document.body).on('keyup', function (e) {
        var keyCode = e.keyCode || e.which;
        var direct = keyCode === 37 ? 'left' : keyCode === 39 ? 'right' : null;

        //если предпросмотр не открыт - обрабатывать нечего
        if (!preview.isOpen()) return;

        //стрелки - сменить картинку
        if (direct) preview.changeImage(direct);

        //esc - закрыть предпросмотр
        if (keyCode === 27) {
            preview.hide(500, function () {
                preview.remove();
            });
        }
    });
});