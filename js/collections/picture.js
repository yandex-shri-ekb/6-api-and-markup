define([
    'jquery',
    'underscore',
    'backbone',
    'models/picture'
], function($, _, Backbone, Picture) {

    return Backbone.Collection.extend({

        model : Picture,

        url : 'http://api-fotki.yandex.ru/api/{{type}}/?format=json',

        initialize : function(options) {
            this.url = this.url.replace('{{type}}', options.type);
        },

        parse : function(response) {
            return response.entries;
        }

    });

});
