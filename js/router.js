define([
    'jquery',
    'underscore',
    'backbone',
], function($, _, Backbone) {

    return Backbone.Router.extend({

        routes : {
            '*type' : 'index'
        },

        initialize : function() {
            Backbone.history.start();
        },

        index : function(type) {
            var types = {
                'top'        : 'Популярные фотографии',
                'recent'     : 'Новые интересные фотографии',
                'podhistory' : 'Фото дня'
            };

            types[type] === undefined && (type = 'top');

            require([
                'collections/picture',
                'views/picture/list'
            ], function(PictureCollection, PictureListView) {
                var collection = new PictureCollection({
                    type : type
                });
                collection.fetch({
                    dataType : 'jsonp',
                    success : function(collection) {
                        $('.menu').show();
                        new PictureListView({
                            collection : collection,
                            title : types[type]
                        });
                    }
                });
            });
        }

    });

});
