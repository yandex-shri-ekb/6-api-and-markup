define(function (require) {
    'use strict';

    return {
        next: function (collection, model) {
            return collection.at((collection.indexOf(model) + 1) % _.size(collection));
        },
        prev: function (collection, model) {
            var index = collection.indexOf(model) - 1;
            return collection.at(index > -1 ? index : _.size(collection) - 1);
        }
    };
});
