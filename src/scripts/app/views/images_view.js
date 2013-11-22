define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        ImageItemView = require('./image_view'),
        Iterator = require('app/utils/iterator'),
        TemplateHelpers = require('app/utils/template_helpers');

    var ImageCollectionView = Marionette.CompositeView.extend({
        itemView: ImageItemView,
        itemViewContainer: '.images__container',
        template: _.template(require('text!../templates/images_template.html')),
        ui: {
            buttonMore: '.images__button-more',
            info: '.images__info',
            spinner: '.images__spinner'
        },
        events: {
            'click .images__button-more': 'more'
        },
        collectionEvents: {
            'complete': 'hideButton hideSpinner',
            'incomplete': 'showButton hideSpinner'
        },

        initialize: function () {
            _.bindAll(this, 'move', 'active', 'keyHandler');
            $(document).keydown(this.keyHandler);
        },
        keyHandler: function (ev) {
            ev.which == 40 && ev.ctrlKey && this.more();
            ev.which == 38 && ev.ctrlKey && $(document.body).animate({
                scrollTop: 0
            }, 200);
        },
        hideButton: function () {
            this.ui.buttonMore.hide();
            this.ui.info.show();
        },
        showButton: function () {
            this.ui.buttonMore.show();
            this.ui.info.hide();
        },
        hideSpinner: function () {
            this.ui.spinner.hide();
        },
        move: function (model, direction) {
            this.active(Iterator[direction](this.collection, model));
        },
        active: function (model) {
            var view = model ? this.children.findByModel(model) : this.children.first();
            view || (view = this.children.first());
            view.ui.thumbnail.trigger('click');
        },
        more: function () {
            if (this.ui.buttonMore.is(':visible')) {
                this.ui.buttonMore.hide();
                this.ui.spinner.show();
                this.collection.more();
            }
        }
    });

    return ImageCollectionView;
});
