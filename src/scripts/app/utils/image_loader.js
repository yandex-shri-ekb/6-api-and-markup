define(function (require) {
    'use strict';

    return {
        get: function (src, className) {
            var image = new Image(),
                d = $.Deferred();

            image.src = src;
            image.className = className;

            function unbind() {
                image.onload = image.onerror = image.onabort = null;
            }

            if (image.complete) {
                d.resolve(image);
            } else {
                image.onload = function () {
                    unbind();
                    d.resolve(image);
                };

                image.onerror = image.onabort = function () {
                    unbind();
                    d.reject(src);
                };
            }

            return d.promise();
        }
    };
});
