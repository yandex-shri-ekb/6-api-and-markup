define(function() {

    return {

        leadZero : function(num) {
            return num < 10 ? '0' + num : num;
        },

        formatDate : function(date) {
            date = new Date(date);
            return date.getDate() + ' ' +
            ('января,февраля,марта,апреля,мая,июня,июля,августа,сентября,октября,ноября,декабря'.split(',')[date.getMonth()]) + ' ' +
                date.getFullYear() + ' в ' + this.leadZero(date.getHours()) + ':' + this.leadZero(date.getMinutes());
        }

    }

});