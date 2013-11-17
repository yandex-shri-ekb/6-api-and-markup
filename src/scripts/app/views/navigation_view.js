define(function (require) {
    'use strict';

    var Marionette = require('marionette');

    var NavigationItemView = Marionette.ItemView.extend({
        template: _.template(require('text!../templates/navigation_template.html')),
        className: 'navigation',
        ui: {
            item: '.navigation__item',
            top: '#top',
            recent: '#recent',
            podhistory: '#podhistory'
        },
        events: {
            'click .navigation__item': 'clickItem'
        },
        active: function (id) {
            this.ui.item.removeClass('navigation__item_active');
            this.ui[id].addClass('navigation__item_active');
        }
    });

    return NavigationItemView;
});
