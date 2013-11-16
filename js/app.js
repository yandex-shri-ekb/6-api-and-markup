define([
    'jquery',
    'underscore',
    'backbone',
    'router'
], function($, _, Backbone, Router) {

    return {

        initialize : function() {
            this.router = new Router;
            this.vent = _.extend({}, Backbone.Events);

            var self = this;
            $('a[href]').on('click', function(event) {
                self.router.navigate($(this).attr('href'), { trigger : true });
                return false;
            });
        }

    };

});
