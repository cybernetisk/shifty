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

/**
 * Format date for handlebar
 */
Handlebars.registerHelper("formatDate", function(datetime, format)
{
    // TODO
    //return datetime;
    return moment(datetime).format(format);
});

/**
 * Lower case method for handlebar
 */
Handlebars.registerHelper('toLowerCase', function(value) {
    return value.toLowerCase();
});

Handlebars.registerHelper('calculateBongs', function(start, stop) {
    var val = 0;

    var ms = moment(stop).diff(moment(start));
    var hours = moment.duration(ms).hours();
    val = Math.floor(hours/2);

    return val;
});

Handlebars.registerHelper('calculateWidth', function(n, all) {
    if(n > 0){
        val = Math.floor(all-n);
        val = (all-val)*25;

        return val;   
    }else{
        return 0;
    }

});




