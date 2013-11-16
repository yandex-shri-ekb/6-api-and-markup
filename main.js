/*globals jQuery*/
/*jslint browser:true*/

(function ($) {
    "use strict";
    
    var $preview = $('.preview'),
        $previewImg = $preview.find('img');
    
    function padLeadingZero(num) {
        return ('0' + num).slice(-2);
    }
    
    function formatDate(dateString) {
        var d = new Date(dateString),
            lz = padLeadingZero,
            date = [lz(d.getDate()), lz(d.getMonth()), d.getFullYear()].join('.'),
            time = [lz(d.getHours()), lz(d.getMinutes())].join(':');
        
        return date + ' ' + time;
    }
        
    function displayPhotos(photos) {
        photos.forEach(function (photo) {
            $('[data-template="image"]').render({
                href:  photo.img.M.href,
                title: photo.title,
                profile: "http://fotki.yandex.ru/users/" + photo.author,
                author: photo.author,
                created: photo.created ? formatDate(photo.created) : '',
                orig: photo.img.orig && photo.img.orig.href,
                large: photo.img.XXXL.href
            }).appendTo('.canvas');
        });
    }
    
    function switchImage(direction) {
        var $nextImg = $('[href="' + $previewImg.attr('src') + '"]').closest('.holder')[direction]();
            
        if ($nextImg) {
            $previewImg.attr('src', $nextImg.find('.crop > a').attr('href'));
        }
    }
    
    $('.canvas').on('click', 'img', function () {
        $previewImg.attr('src', $(this).parent('a').attr('href'));
        $preview.show();
        
        return false;
    });
    
    $preview.on('click', function () {
        $preview.hide();
    });
    
    $(document).on('keydown', function (event) {
        switch (event.keyCode) {
        case 27: // esc
            $preview.trigger('click');
            break;
        case 37: // left
            switchImage('prev');
            break;
        case 39: // right
            switchImage('next');
            break;
        }
    });
    
    $.getJSON('http://api-fotki.yandex.ru/api/top/?format=json&callback=?', function (data) {
        displayPhotos(data.entries);
    });
}(jQuery));