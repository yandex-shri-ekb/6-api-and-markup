define([
    'jquery',
    'underscore',
    'backbone',
    'views/picture/item',
    'text!templates/picture/list.html'
], function($, _, Backbone, PictureItemView, tpl) {

    return Backbone.View.extend({

        className : 'pictures',

        template : _.template(tpl),

        initialize: function(options) {
            this.render(options.title);
        },

        render : function(title) {
            this.$el.html(this.template({ title : title }));
            this.collection.each(this.addOne, this);
            $('#content').html(this.el);
            return this;
        },

        addOne : function(picture) {
            var view = new PictureItemView({ model : picture });
            this.$('.pictures__items').append('\n').append(view.render().el);
        },

    });

});
