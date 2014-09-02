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

Handlebars.registerHelper('calculateRemainingWidth', function(n, all) {
    if(n != all){
        val =  (n/all)*100;
        return Math.floor(val);   
    }else{
        return 99;
    }

});

Handlebars.registerHelper('calculateWidth', function(n, all) {
    if(n != all){
        val =  (n/all)*100;
        return 100-Math.floor(val);   
    }else{
        return 1;
    }

});

Handlebars.registerHelper("getResponsible", function(datetime, format)
{
    // TODO
    //return datetime;
    return moment(datetime).format(format);
});

Handlebars.registerHelper("getTerm", function()
{   
    year = moment().format('YYYY');
    month = moment().format('M');
    if(month<8){
        return "våren "+year;
    }else{
        return "høsten "+year;
    }
});

Handlebars.registerHelper('shiftType', function(id) {
    try {
        return shifty.shiftTypes.get(id).get("title");
    } catch (e) {
        console.error("Unknown shift type: "+id, e);
        return "unknown";
    }
});

