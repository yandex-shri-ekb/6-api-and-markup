define(function (require) {
    'use strict';

    var Marionette = require('marionette'),
        TemplateHelpers = require('app/utils/template_helpers');

    var DetailItemView = Marionette.ItemView.extend({
        template: _.template(require('text!../templates/detail_template.html')),
        className: 'detail',
        ui: {
            next: '.detail__move_next',
            prev: '.detail__move_prev',
            close: '.detail__close'
        },
        initialize: function() {
            var self = this;
            $(document).keydown(function(ev) {
                ev.which == 39 && ev.ctrlKey && self.trigger('next:click', self.model);
                ev.which == 37 && ev.ctrlKey && self.trigger('prev:click', self.model);
                ev.which == 27 && self.trigger('close:click', self.model);
            });
        },
        onRender: function() {
            var self = this;
            self.ui.next.on('click', function () {
                self.trigger('next:click', self.model);
            });
            self.ui.prev.on('click', function () {
                self.trigger('prev:click', self.model);
            });
            self.ui.close.on('click', function () {
                self.trigger('close:click', self.model);
            });
        },
        render: function(model) {
            this.model = model;
            return Marionette.ItemView.prototype.render.call(this);
        },
        templateHelpers: TemplateHelpers
    });

    return DetailItemView;
});
