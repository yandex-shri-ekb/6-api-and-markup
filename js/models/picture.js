define([
    'jquery',
    'underscore',
    'backbone',
    'helpers/helper',
    'views/picture/detail'
], function($, _, Backbone, Helper, PictureDetailView) {

    return Backbone.Model.extend({

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

    });

});
