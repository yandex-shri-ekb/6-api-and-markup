define(function (require) {
    'use strict';

    var Backbone = require('backbone'),
        ImageModel = require('./image'),
        Url = require('app/utils/url');

    var ImagesCollection = Backbone.Collection.extend({
        model: ImageModel,
        parse: function (response) {
            this.next = response.links.next;
            this.trigger(response.links.next ? 'incomplete' : 'complete');
            return response.entries;
        },
        fetchBy: function (type) {
            return this.fetch({
                url: Url.images(type),
                dataType: 'jsonp',
                data: {
                    format: 'json',
                    limit: 20
                }
            });
        },
        more: function () {
            return this.fetch({
                url: this.next,
                dataType: 'jsonp',
                remove: false
            });
        }
    });

    return ImagesCollection;
});
