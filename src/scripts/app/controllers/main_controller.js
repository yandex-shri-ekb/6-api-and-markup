define(function (require) {
    'use strict';

    var Bus = require('app/bus'),
        ImagesView = require('app/views/images_view'),
        DetailView = require('app/views/detail_view'),
        NavigationView = require('app/views/navigation_view'),
        Images = require('app/entities/images');

    var imagesCollection = new Images(),
        navigationView = new NavigationView(),
        detailView = new DetailView(),
        imagesView = new ImagesView({
            collection: imagesCollection
        });

    var $activeImage;

    imagesView.on('itemview:thumbnail:click', function (childView) {
        detailView.close();
        $activeImage && $activeImage.removeClass('image_expanded');
        $activeImage = ($activeImage === childView.$el)
            ? undefined
            : childView.$el.append(detailView.render(childView.model).$el);
    });

    detailView.on('prev:click', imagesView.move);
    detailView.on('next:click', imagesView.move);
    detailView.on('close:click', imagesView.active);

    return {
        show: function (type) {
            navigationView.ui.spinner.show();
            imagesCollection.fetchBy(type).then(function () {
                navigationView.active(type);
                detailView.model = null;
            });
        },
        start: function () {
            Bus.trigger('app:show:navigationRegion', navigationView);
            Bus.trigger('app:show:mainRegion', imagesView);
        },
        redirect: function () {
            Backbone.history.navigate('#/show/top');
        }
    };
});
