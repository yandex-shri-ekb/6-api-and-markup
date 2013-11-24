define({
    filter: function (list, test, context) {
        return _.reduce(list, function (obj, val, key) {
            if (test.call(context, val, key, list)) {
                obj[key] = val;
            }
            return obj;
        }, {}, context);
    }
});
