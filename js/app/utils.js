'use strict';

require([], function() {
    if (!String.prototype.format) {
        /**
         * "{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET")
         */
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }
});

