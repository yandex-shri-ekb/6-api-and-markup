define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'text!templates/picture/detail.html'
], function($, _, Backbone, App, tpl) {

    return Backbone.View.extend({

        tagName : 'li',

        className : 'preview',

        template : _.template(tpl),

        initialize: function(options) {
            App.vent.on('picture:select', this.close, this);
            this.render(options.addBefore);
        },

        events : {
            'click  .preview__close' : 'close',
            'change .preview__sizes' : 'otherImageSize'
        },

        render : function(element) {
            var $el = this.$el;
            $el.html(this.template(this.model.toJSON())).css('display', 'none');

            // Вставляем превью перед началом строки
            $(element).before($el);

            // Разворачиваем превью и прокручиваем
            $el.slideDown('fast', function() {
                $(document.body).animate({ scrollTop: $el.offset().top - 10 }, 'fast');
            });

            return this;
        },

        close : function() {
            this.model.trigger('preview:close');

            // Сворачиваем и удаляем превью
            var self = this;
            this.$el.slideUp('fast', function() {
                self.remove();
            });
        },

        otherImageSize : function(event) {
            // Получаем данные о выбранном размере
            var size = $(event.target).val(),
                img = this.model.get('img')[size];

            // Открываем в новой вкладке
            window.open(img.href, '_blank');
        }

    });

});
