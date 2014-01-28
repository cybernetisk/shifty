Handlebars.registerHelper('formatTime', function(date) {
    var val = "";
    if (date instanceof Date) {
        var h = date.getHours();
        var m = date.getMinutes();

        val += h < 10 ? '0'+h : h;
        val += m < 10 ? ':0'+m : ':'+m;
    } else {
        val = date;
    }

    return val;
});
