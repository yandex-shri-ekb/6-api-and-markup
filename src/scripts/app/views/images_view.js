define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        Iterator = require('app/utils/iterator'),
        TemplateHelpers = require('app/utils/template_helpers');

    var ImageItemView = Marionette.ItemView.extend({
        template: _.template(require('text!../templates/image_template.html')),
        className: 'image',
        ui: {
            thumbnail: '.image__thumbnail'
        },
        events: {
            'click .image__thumbnail': 'clickThumbnail'
        },
        templateHelpers: _.extend({
            getOrig: function () {
                return this.images.orig ? this.images.orig : this.images.L;
            }
        }, TemplateHelpers),
        clickThumbnail: function () {
            this.$el.toggleClass('image_expanded');
            this.trigger('thumbnail:click');
        }
    });

    var ImageCollectionView = Marionette.CollectionView.extend({
        itemView: ImageItemView,
        move: function (model, direction) {
            this.active(Iterator[direction](this.collection, model));
        },
        active: function (model) {
            var view = model ? this.children.findByModel(model) : this.children.first();
            view || (view = this.children.first());
            view.ui.thumbnail.trigger('click');
        }
    });

    return ImageCollectionView;
});
