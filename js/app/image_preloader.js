define(['jquery'], function($) {
    'use strict';

    /**
     * @export app/image_preloader
     * @class ImagePreloader
     */
    function ImagePreloader() {
        this._waitLoading = null;
    }

    ImagePreloader.prototype.preload = function(imgSrc) {
        var preloader = this,
            objImagePreloader = new Image(),
            d = $.Deferred();

        if(preloader._waitLoading !== null) {
            preloader._waitLoading.onload = function() {};
            preloader._waitLoading = null;
        }

        objImagePreloader.src = imgSrc;
        if(objImagePreloader.complete) {
            d.resolve(imgSrc);
        }
        else {
            preloader._waitLoading = objImagePreloader;
            objImagePreloader.onload = function() {
                d.resolve(imgSrc);
                objImagePreloader.onload = function() {};
            }
        }

        return d.promise();
    };

    return ImagePreloader;
});