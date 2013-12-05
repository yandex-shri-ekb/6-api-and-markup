/**
 * Работа с Яндекс API.Фото. AJAX. Подгрузка шаблонов
 * 
 * @author Artem Kuzvesov <arktuz@gmail.com>
 * @version 0.01
 * @copyright Artem Kuzvesov 2013
 * 
 */
define(['jquery'], function($) {
	$.ajax({
        url: 'js/templates/preview.html',
        dataType: 'text',
        success: function (answer) {
            $('section.content').after(answer);
        }
    });
	$.ajax({
        url: 'js/templates/miniature.html',
        dataType: 'text',
        success: function (answer) {
            $('section.content').after(answer);
        }
    });
});