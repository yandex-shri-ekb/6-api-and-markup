define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    return Backbone.Router.extend({

        routes : {
            '*type'        : 'index'
        },

        index : function(type) {
            var types = {
                'top'        : 'Популярные фотографии',
                'recent'     : 'Новые интересные фотографии',
                'podhistory' : 'Фото дня'
            };

            if (type === null || types[type] === undefined) {
                type = 'top';
            }

            require([
                'collections/picture',
                'views/picture/list'
            ], function(PictureCollection, PictureListView) {
                var results = new PictureCollection({
                    type : type
                });
                results.fetch({
                    dataType: 'jsonp',
                    success : function(collection) {
                        var list = new PictureListView({
                            collection : collection,
                            title : types[type]
                        });
                    }
                });
            });
        },

    });

});
