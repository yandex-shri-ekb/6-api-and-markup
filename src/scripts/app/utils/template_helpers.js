define(function (require) {
    'use strict';

    return {
        imageLink: function (image, tagClass) {
            return $('<a>', {
                href: image.href,
                target: '_blank',
                text: image.width + '×' + image.height,
                class: tagClass
            }).get(0).outerHTML;
        },
        authorLink: function (author, tagClass) {
            return $('<a>', {
                href: author.href,
                target: '_blank',
                text: author.name,
                class: tagClass
            }).get(0).outerHTML;
        }
    };
});
