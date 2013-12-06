'use strict';

var App = (function(){

    function App (){

        // адрес запроса URL с картинками
        this.urlApi = 'https://api-fotki.yandex.ru/api/top/?format=json&callback=?';

        // хранение элементов DOM
        this.view = {
            $slider  : $('.slider'),
            $loading : $('.b-loading')
        };

        // опции для расчета ширины изображений
        this.options = {
            viewWidth       : 1000 - 10, // ширина одной "строки" галереи
            imageHeight     : 150,       // высота изображений
            imageMargin     : 10,        // отступ между изображениями, учитывается при расчете ширины
            maxCropRate     : 0.1,       // максимально допустимое сжатие изображения
            maxSliderWidth  : 500,       // максимальная длина изображения в слайдере
            maxSliderHeight : 400        // максимальная высота изображения в слайдере
        };

        // хранение полученных изображений от api-fotki
        this.listImage = [];
        // временное хранение изображений для заполнения галереи
        this.tmpListImage = [];
        // текущий индекс картинки для слайдера
        this.currentI = -1;

        // запуск приложения
        this.init();
    }

    App.prototype.init = function() {
        this.loadImages();
        this.assignEvents();
    };

    // События приложения
    App.prototype.assignEvents = function() {
        $(document).on('click', '.b-image-block__image', $.proxy(this.onClickImage, this));
        $(document).on('click', '.b-btn-prev', $.proxy(this.onClickPrevBtn, this));
        $(document).on('click', '.b-btn-next', $.proxy(this.onClickNextBtn, this));
        $(document).on('click', '.b-btn-close', $.proxy(this.onClickClose, this));
    };

    App.prototype.onClickImage = function(e) {
        var $img = $(e.currentTarget);
        $img.closest('.b-image-row').before(this.view.$slider);
        var id = $img.data('id');
        var image = this.getImageById(id);
        this.showImageInSlider(image);
    };

    App.prototype.onClickPrevBtn = function(e) {
        var image = this.prevImage();
        if(image) {
            this.showImageInSlider(image);
        }
    };

    App.prototype.onClickNextBtn = function(e) {
        var image = this.nextImage();
        if(image) {
            this.showImageInSlider(image);
        }
    };

    App.prototype.onClickClose = function(e) {
        if (!this.view.$slider.hasClass('hide')) {
            this.view.$slider.addClass('hide');
        }
    };

    App.prototype.showImageInSlider = function(image) {
        var imageXL = image.img.XL;

        // рассчитываем высоту и ширину изображения, чтобы оно поместилось в слайдер
        // исходя из максимальной ширины изображения
        var height = imageXL.height * this.options.maxSliderWidth / imageXL.width;
        var width = this.options.maxSliderWidth;

        // перерассчитываем длину и ширину на основе высоты изображения
        // если высота получилась больше, чем допустимо
        if(height > this.options.maxSliderHeight) {
            height = this.options.maxSliderHeight;
            width = image.width * height / image.height;
        }

        // создаем изображение
        var $img = $('<img>', {
            'class'  : 'b-slider__image',
            'src'    : imageXL.href,
            'width'  : width,
            'height' : height
        });

        // очищаем контейнер для изображения
        var $wrap = this.view.$slider.find('.b-slider__info_wrap');
        $wrap.html(false);

        // вставляем в контейнер заголовок, автора и дату создания изображения
        $wrap.append(
            $('<div>', {
                'class': 'b-slider__info__title'
            }).text(image.title),

            $('<div>', {
                'class': 'b-slider__info__author'
            }).text(image.author),

            $('<div>', {
                'class': 'b-slider__info__created'
            }).text(this.formatDate(image.created))
        );

        // вставляем изображение в слайдер
        this.view.$slider.find('.b-slider__image_placeholder__inner').html($img);

        // показываем слайдер
        if (this.view.$slider.hasClass('hide')) {
            this.view.$slider.removeClass('hide');
        }
    };

    // Ищет изображение по ID
    App.prototype.getImageById = function(id) {
       for(var i = 0, l = this.listImage.length; i < l; i++) {
           if(this.listImage[i].id == id) {
               this.currentI = i;
               return this.listImage[i];
           }
       }
       return null;
    };

    // Возвращает предыдущее изображение, если оно существует
    App.prototype.prevImage = function() {
        if(this.currentI > 0) {
            this.currentI--;
            return this.listImage[this.currentI];
        }
        return false;
    };

    // Возвращает следующее изображение, если оно существует
    App.prototype.nextImage = function() {
        if(this.currentI < this.listImage.length - 1) {
            this.currentI++;
            return this.listImage[this.currentI];
        }
        return false;
    };

    // Загрузка изображений
    App.prototype.loadImages = function() {
        $.ajax({
            url : this.urlApi,
            dataType: "json",
            context : this
        })
        .done(this.onDoneLoadImages)
        .fail(this.onFailLoadImages)
    };

    // Событие при успешной загрузке изображений
    App.prototype.onDoneLoadImages = function(data) {
        this.listImage = data.entries;
        this.showGallery();
        this.view.$loading.addClass('hide');
    };

    // Событие при неудачной загрузке изображений
    App.prototype.onFailLoadImages = function() {
        alert('Произошла ошибка при загрузке. Попробуйте обновить страницу.');
    };

    App.prototype.showGallery = function() {

        this.tmpListImage = this.listImage.slice(0);
        var listRow = [];

        while(this.tmpListImage.length) {
            listRow.push(this.fillRow());
        }
        this.showImages(listRow);
    };

    App.prototype.showImages = function(listRow) {

        // Создаем новую коллекцию строк изображений для галереи
        var $rows = $();

        for(var i = 0; i < listRow.length; i++) {
            // Создаем строку
            var $row = $('<div class="b-image-row">');
            // Получаем изображения для этой строки
            var rowItems = listRow[i];

            // Создаем блоки изображения для строки
            for(var j = 0, k = rowItems.length; j < k; j++) {
                var image = rowItems[j];
                var smallImage = image.img.M;

                var $imageBlock = $('<div>', {
                    'class': 'b-image-block'
                });

                var $wrap = $('<div class="b-image-block__image_wrap">');

                var $image = $('<img>', {
                    'class'  : 'b-image-block__image',
                    'src'    : smallImage.href,
                    'width'  : image.options.width - image.options.cropX,
                    'height' : image.options.height,
                    'data-id': image.options.id
                });

                // Блок, появляющийся при наведении на изображение
                var $hint = $('<div>', {
                    'class'  : 'b-image-block__hint b-hint'
                });

                // Добавляем к этому блоку заголовок, автора и время создания изображения
                $hint.append(
                    $('<div>', {
                        'class': 'b-hint__title b-hint__text',
                        position: 'absolute'
                    }).text(image.title),

                    $('<div>', {
                        'class': 'b-hint__author b-hint__text'
                    }).text(image.author),

                    $('<div>', {
                        'class': 'b-hint__created b-hint__text'
                    }).text(this.formatDate(image.created))
                );

                // Собираем блоки в строку
                $wrap.append($image);
                $imageBlock.append($hint, $wrap);
                $row.append($imageBlock);
            }
            // Добавляем строку в коллекцию сток
            $rows = $rows.add($row);
        }
        // Отображаем элементы на странице
        $('.b-images-list').prepend($rows);
    };

    // Заполняет "строку" галереи изображениями во всю ширину с равными отступами
    App.prototype.fillRow = function() {

        // Суммарная ширина строки
        var sumWidth = 0;
        var rowItems = [];
        var opt = this.options;

        // Пока существуют изображения для вставки
        while(this.tmpListImage.length) {
            // Читаем изображение
            var image = this.tmpListImage[0];
            var smallImage = image.img.M;

            // Преобразовываем ширину согласно настройкам высоты изображения
            var width =  Math.floor(smallImage.width * opt.imageHeight  / smallImage.height);

            sumWidth += width + opt.imageMargin;

            // Добавляем настройки изображения для галереи
            image.options = {
                id     : image.id,
                width  : width,
                height : opt.imageHeight
            };
            rowItems.push(image);
            this.tmpListImage.splice(0, 1);
            var isNormal = opt.maxCropRate * sumWidth < opt.viewWidth;
            if(sumWidth + opt.imageMargin > opt.viewWidth || !isNormal) break;
        }
        rowItems = this.modifyRow(rowItems, sumWidth);

        return rowItems;
    };

    // Считает какую ширину, надо отрезать, чтобы изображения поместились в строку
    App.prototype.modifyRow = function(rowItems, sumWidth) {
        var count = rowItems.length;

        // Разница между текущей шириной строки и максимально допустимой
        var diffWidth = Math.abs( sumWidth - this.options.viewWidth);
        // То, что надо отрезать от каждого изображения
        var avgCrop = Math.floor( diffWidth / count );

        // Если ширина изображений меньше, чем ширина строки, то не обрезаем их
        var dontCrop = sumWidth < this.options.viewWidth;

        for(var i = 0; i < count; i++) {
            var image = rowItems[i];
            if(dontCrop) { // не обрезаем
                image.options.cropX = 0;
            } else if(i !== count-1) { // обрезаем со средним значением
                image.options.cropX = avgCrop;
            } else { // могут остаться лишние пиксели, которые мы добавим к последниму изображению
                image.options.cropX = diffWidth - avgCrop * (count - 1);
            }
        }
        return rowItems;
    };

    // Форматирование даты в удобный вид
    App.prototype.formatDate = function(date) {
        date = new Date(date);
        var months = [
            'января',
            'февраля',
            'марта',
            'апреля',
            'мая',
            'июня',
            'июля',
            'августа',
            'сентября',
            'октября',
            'ноября',
            'декабря'
        ];
        return date.getDay()+1 + " " + months[date.getMonth()] + " " + date.getFullYear();
    };
    return App;
})();

$(function(){
    new App;
});
