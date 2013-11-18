define(function (require) {
    'use strict';

    var getHandler = function (context, name, ev) {
        return function () {
            context.trigger(name + ':' + ev, context.model, name);
        };
    };

    return {
        triggers: function (elements, ev, context) {
            for (var i = 0, len = elements.length; i < len; i++) {
                context.ui[elements[i]].on(ev, getHandler(context, elements[i], ev));
            }
        }
    };
});
