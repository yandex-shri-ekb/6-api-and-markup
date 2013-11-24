define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
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
        templateHelpers: TemplateHelpers,

        clickThumbnail: function () {
            this.$el.toggleClass('image_expanded');
            this.trigger('thumbnail:click');
        }
    });

    return ImageItemView;
});
