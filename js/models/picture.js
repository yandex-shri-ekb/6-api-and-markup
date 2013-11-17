define([
    'jquery',
    'underscore',
    'backbone',
    'helpers/helper',
    'views/picture/detail'
], function($, _, Backbone, Helper, PictureDetailView) {

    return Backbone.Model.extend({

        initialize: function(attributes, options) {
            this.collection = options.collection;
        },

        parse : function(response, options) {
            return {
                id : response.id,
                title : _.escape(response.title),
                author : {
                    name : response.author,
                    url : 'http://fotki.yandex.ru/users/' + response.author + '/photos/'
                },
                pubDate : Helper.formatDate(response.published),
                img : response.img
            };
        },

        index : function() {
            return this.collection.indexOf(this);
        },

        next : function() {
            return this.collection.at(this.index() + 1) || null;
        },

        prev : function() {
            return this.collection.at(this.index() - 1) || null;
        },

    });

});
