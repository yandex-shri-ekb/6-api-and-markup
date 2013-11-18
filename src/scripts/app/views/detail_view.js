define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        TemplateHelpers = require('app/utils/template_helpers'),
        Invork = require('app/utils/invork');

    var DetailItemView = Marionette.ItemView.extend({
        template: _.template(require('text!../templates/detail_template.html')),
        className: 'detail',
        ui: {
            next: '.detail__move_next',
            prev: '.detail__move_prev',
            close: '.detail__close'
        },
        initialize: function() {
            $(document).keydown(_.bind(this.keyHandler, this));
        },
        keyHandler: function(ev) {
            ev.which == 39 && ev.ctrlKey && this.trigger('next:click', this.model, 'next');
            ev.which == 37 && ev.ctrlKey && this.trigger('prev:click', this.model, 'prev');
            ev.which == 27 && this.trigger('close:click', this.model);
        },
        onRender: function() {
            Invork.triggers(['next', 'prev', 'close'], 'click', this);
        },
        render: function(model) {
            this.model = model;
            return Marionette.ItemView.prototype.render.call(this);
        },
        templateHelpers: TemplateHelpers
    });

    return DetailItemView;
});
