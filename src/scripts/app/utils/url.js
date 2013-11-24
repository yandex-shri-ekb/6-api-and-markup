define({
    author: function (name) {
        return 'http://fotki.yandex.ru/users/' + name;
    },
    images: function (type) {
        return 'http://api-fotki.yandex.ru/api/' + type + '/';
    }
});
