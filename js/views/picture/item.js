define([
    'jquery',
    'underscore',
    'backbone',
    'views/picture/detail',
    'text!templates/picture/item.html'
], function($, _, Backbone, PictureDetailView, tpl) {

    return Backbone.View.extend({

        tagName : 'li',

        className : 'picture',

        template : _.template(tpl),

        initialize: function() {
            // При закрытии превью убираем обводку
            window.app.vent.on('preview:close', function() {
                this.$el.removeClass('picture_active_yes');
            }, this);

            this.render();
        },

        events : {
            'click .picture__link' : 'showLargerPicture',
            'mouseout .picture__preview' : 'showPictureInfo',
            'mouseover .picture__preview' : 'showPictureInfo',
        },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        showLargerPicture : function() {
            var $el = this.$el,
                $prevEl;

            // Ищем начало строки для вставки превью
            while (true) {
                $prevEl = $el.prev();
                if ($prevEl.length > 0) {
                    if ($prevEl.position().left > $el.position().left) {
                        break;
                    } else {
                        $el = $prevEl;
                    }
                } else {
                    break;
                }
            }

            var view = new PictureDetailView({
                model : this.model,
                addBefore : $el
            });

            this.$el.addClass('picture_active_yes');
        },

        showPictureInfo : function(event) {
            this.$el.toggleClass('picture_hovered_yes');
        }

    });

});
