define([
    'jquery',
    'underscore',
    'backbone',
    'app',
    'views/picture/detail',
    'text!templates/picture/item.html'
], function($, _, Backbone, App, PictureDetailView, tpl) {

    return Backbone.View.extend({

        tagName : 'li',

        className : 'picture',

        template : _.template(tpl),

        initialize: function() {
            App.vent.on('picture:select', this.disactivate, this);
            this.model.on('picture:select', this.showPreview, this);
            this.model.on('preview:close', this.disactivate, this);
            this.render();
        },

        events : {
            'mouseout  .picture__preview' : 'hover',
            'mouseover .picture__preview' : 'hover',
            'click     .picture__link'    : 'selectPicture'
        },

        render : function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        selectPicture : function() {
            if (this.$el.hasClass('picture_active_yes')) {
                return;
            }
            App.vent.trigger('picture:select');
            this.model.trigger('picture:select', this);
        },

        showPreview : function() {
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

            new PictureDetailView({
                model : this.model,
                addBefore : $el
            });

            this.activate();
        },

        activate : function() {
            this.$el.addClass('picture_active_yes');
            return this;
        },

        disactivate : function() {
            this.$el.removeClass('picture_active_yes');
            return this;
        },

        hover : function() {
            this.$el.toggleClass('picture_hovered_yes');
            return this;
        }

    });

});
