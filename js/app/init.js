require(['jquery',
	     'app/app'], function($, App) {
	$(document).ready(function () {
		var app = new App();
		app.first();
	});
});