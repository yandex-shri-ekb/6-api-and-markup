define(function (require) {
    'use strict';

    var image;

    var unbind = function () {
        image && (image.onload = image.onerror = image.onabort = $.noop);
    };

    var getHandler = function (handler) {
        return function () {
            unbind();
            handler(image);
        };
    };

    return {
        get: function (options) {
            var d = $.Deferred();

            unbind();

            image = $('<img>', options).get(0);

            if (image.complete) {
                d.resolve(image);
            } else {
                image.onload = getHandler(d.resolve);
                image.onerror = image.onabort = getHandler(d.reject);
            }

            return d.promise();
        }
    };
});
