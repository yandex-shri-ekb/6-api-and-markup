/*globals Ember, moment*/
/*jslint browser:true*/

(function () {
    'use strict';

    var App = Ember.Application.create({
        LOG_TRANSITIONS: true
    });

    App.Router = Ember.Router.extend({
        location: 'none'
    });

    App.Router.map(function () {
        this.resource('photos', function () {
            this.resource('photo', { path: '/:photo_id' });
        });
    });

    App.IndexRoute = Ember.Route.extend({
        redirect: function () {
            this.transitionTo('photos');
        }
    });

    App.PhotosRoute = Ember.Route.extend({
        model: function () {
            var url = "http://api-fotki.yandex.ru/api/top/?format=json&callback=?";

            return Ember.$.getJSON(url).then(function (data) {
                var photos = Ember.A();

                data.entries.forEach(function (entry) {
                    photos.pushObject(Ember.Object.create({
                        href:  entry.img.M.href,
                        title: entry.title,
                        profile: "http://fotki.yandex.ru/users/" + entry.author,
                        author: entry.author,
                        created: entry.created,
                        orig: entry.img.orig && entry.img.orig.href,
                        large: entry.img.XXXL.href
                    }));

                    photos.forEach(function (photo, i) {
                        var next = i + 1,
                            prev = i - 1;

                        if ([next] < photos.length) {
                            photos[i].set("next", photos[[next]]);
                        }
                        if (prev >= 0) {
                            photos[i].set("prev", photos[prev]);
                        }
                    });
                });

                return photos;
            });
        }
    });

    App.PhotoView = Em.View.extend({
        click: function () {
            this.get('controller').send('close');
        },
        didInsertElement: function() {
            return this.$().attr({ tabindex: 1 }), this.$().focus();
        },
        keyDown: function(event) {
            switch (event.keyCode) {
            case 27: // esc
                this.get('controller').send('close');
                break;
            case 37: // left
                this.get('controller').send('prev');
                break;
            case 39: // right
                this.get('controller').send('next');
                break;
            }
        }
    });

    App.PhotoController = Ember.ObjectController.extend({
        actions: {
            close: function () {
                this.transitionToRoute('photos');
            },
            prev: function () {
                if (this.get('model.prev')) {
                    this.transitionToRoute('photo', this.get('model.prev'));  
                } 
            },
            next: function () {
                if (this.get('model.next')) {
                    this.transitionToRoute('photo', this.get('model.next'));  
                } 
            },
        }
    });

    Ember.Handlebars.helper('formatDate', function (date) {
        return date && moment(date).format('DD.MM.YY hh:mm');
    });
}());