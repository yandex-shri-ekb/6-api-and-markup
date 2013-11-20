define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        TemplateHelpers = require('app/utils/template_helpers'),
        ImageLoader = require('app/utils/image_loader'),
        Invork = require('app/utils/invork');

    var DetailItemView = Marionette.ItemView.extend({
        template: _.template(require('text!../templates/detail_template.html')),
        className: 'detail',
        ui: {
            next: '.detail__move_next',
            prev: '.detail__move_prev',
            close: '.detail__close',
            spinner: '.detail__spinner'
        },
        initialize: function() {
            _.bindAll(this, 'keyHandler', 'renderImage', 'showError');
            $(document).keydown(this.keyHandler);
        },
        keyHandler: function(ev) {
            ev.which == 39 && ev.ctrlKey && this.trigger('next:click', this.model, 'next');
            ev.which == 37 && ev.ctrlKey && this.trigger('prev:click', this.model, 'prev');
            ev.which == 27 && this.trigger('close:click', this.model);
        },
        renderImage: function(image) {
            this.ui.spinner.replaceWith(image);
        },
        showError: function() {
            this.ui.spinner.replaceWith('Ошибка :-(');
        },
        onRender: function() {
            Invork.triggers(['next', 'prev', 'close'], 'click', this);
            ImageLoader
                .get(this.model.get('images').L.href, 'detail__image')
                .then(this.renderImage, this.showError);
        },
        render: function(model) {
            this.model = model;
            return Marionette.ItemView.prototype.render.call(this);
        },
        templateHelpers: TemplateHelpers
    });

    return DetailItemView;
});
