if (!String.prototype.format) {
    /**
     * "{0} is dead, but {1} is alive! {0} {2}".format("ASP", "ASP.NET")
     */
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}
//$.get('http://api-fotki.yandex.ru/api/top/?format=json');

$(function() {
    var $body = $(document.body),
        $images = $('#images', $body),
        $imageTemplate = $('#images-template', $body);

    var url = 'http://api-fotki.yandex.ru/api/{0}/?format=json'.format('top');
    $.ajax({
        url: url,
        dataType: 'jsonp'
    })
    .done(function(response) {
        var context = {
            images: response.entries
        };

        console.log(context);

        var source   = $imageTemplate.html(),
            template = Handlebars.compile(source),
            html     = template(context);

        $images.html(html);
    });
});
