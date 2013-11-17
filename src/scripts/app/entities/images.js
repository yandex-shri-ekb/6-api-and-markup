define(function (require) {
    'use strict';

    var Backbone = require('backbone'),
        Url = require('app/utils/url'),
        Dates = require('app/utils/dates'),
        Obj = require('app/utils/obj');

    var ImageModel = Backbone.Model.extend({
        parse: function (response) {
            return {
                title: response.title,
                images: Obj.filter(response.img, function(val, key) {
                    return key.indexOf('S') === -1;
                }),
                date: Dates.formatDate(response.published),
                author: {
                    name: response.author,
                    href: Url.author(response.author)
                }
            };
        }
    });

    var ImagesCollection = Backbone.Collection.extend({
        model: ImageModel,
        parse : function (response) {
            return response.entries;
        },
        fetchBy: function (type) {
            return this.fetch({
                url: Url.images(type),
                dataType: 'jsonp',
                data: {
                    format: 'json'
                }
            });
        }
    });

    return {
        model: ImageModel,
        collection: ImagesCollection
    };
});
