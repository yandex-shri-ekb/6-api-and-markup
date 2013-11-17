define(function (require) {
    'use strict';

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

    var leadingZero = function (number) {
        return number < 10 ? '0' + number : number;
    };

    return {
        formatDate: function (str) {
            var date = new Date(str);
            var formattedDate =
                    date.getDate() + ' ' +
                    months[date.getMonth()] + ' ' +
                    date.getFullYear() + ' в ' +
                    leadingZero(date.getHours()) + ':' +
                    leadingZero(date.getMinutes());

            return formattedDate;
        }
    };
});
