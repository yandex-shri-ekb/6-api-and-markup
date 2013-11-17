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
            _.bindAll(this, 'keyPress');
            App.vent.on('picture:select', this.close, this);
            $(document).on('keydown', this.keyPress);
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

            // Удаляем обработчик
            $(document).off('keydown', this.keyPress);

            // Сворачиваем и удаляем превью
            var self = this;
            this.$el.slideUp('fast', function() {
                self.remove();
            });
        },

        keyPress : function(e) {
            if (e.which === 27) {
                this.close();
            }
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
