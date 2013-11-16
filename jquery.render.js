/*globals jQuery*/

jQuery.fn.render = function (data) {
    'use strict';

    var tpl = jQuery(this).html(),
        i;

    for (i in data)  {
        if (data.hasOwnProperty(i)) {
            tpl = tpl.replace(new RegExp('{' + i + '}', 'g'), data[i]);
        }
    }

    return jQuery(tpl);
};