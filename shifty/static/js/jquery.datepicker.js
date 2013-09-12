(function($) {

Date.prototype.prevMonday = function() {
  var d = new Date(this);
  var day = d.getDay();
  var diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

Date.prototype.nextSunday = function() {
  var d = new Date(this);
  var day = d.getDay();
  var diff = d.getDate() + 7 - (day == 0 ? 7 : day);
  return new Date(d.setDate(diff));
};

Date.prototype.today = function() {
    var d = new Date();
    return this.getDate() == d.getDate() &&
        this.getMonth() == d.getMonth() &&
        this.getFullYear() == d.getFullYear();
};

// Month names
window.months = ["januar","februar", "mars", "april", "mai", "juni",
    "juli", "august", "september", "oktober", "november", "desember"];

$.fn.datepicker = function(year, month) {
  var $this = $(this);

  // Date to keep track of the current month of the datepicker
  var d;
  if (year && month) d = new Date(year, month);
  else if (year) d = new Date(year);
  else d = new Date();

  // The table to fill in
  var $table = $(this);
  $table.html("");

  function addCallback($el, date) {
    var d = new Date(date);
    $el.click(function() {
      $this.trigger("select", d);
    });
  }

  function showMonth(date, $body) {
    // Reset body
    $body.html("");

    // Start of the month
    var d0 = new Date(date);
    d0.setMilliseconds(0);
    d0.setSeconds(0);
    d0.setMinutes(0);
    d0.setHours(0);
    d0.setDate(1);

    // End of the month
    var d1 = new Date(d0);
    d1.setMonth(d1.getMonth()+1);

    // First and last day of preview
    var start = d0.prevMonday();
    var end = d1.nextSunday();

    // Add dates
    while(start <= end) {
      var $row = $("<tr></tr>");

      for(var i = 0; i < 7; i++) {
        var $td = $("<td>"+start.getDate()+"</td>");
        if (start.today()) {
            $td.addClass("today");
        }
        addCallback($td, start);
        $row.append($td);
        start.setDate(start.getDate()+1);
      }
      $table.append($row);
    }

    $this.trigger("resize");
  }

  // Add cols
  var $cols = $("<colgroup></colgroup>");
  for (var i = 0; i < 7; i++) {
    $cols.append('<col style="width:14.29%;" />');
  }
  $table.append($cols);

  // Add head
  var $head = $("<thead></thead>");
  $table.append($head);

  // Add body
  var $body = $("<tbody></tbody>");
  $table.append($body);

  // Add the month row
  var $row = $("<tr></tr>");
  var $month = $('<th colspan="5">'+months[d.getMonth()]+' '+d.getFullYear()+'</th>');
  var $prev = $('<th class="prev">❮</th>');
  $prev.click(function() {
    d.setMonth(d.getMonth()-1);
    showMonth(d, $body);
    $month.html(months[d.getMonth()]+' '+d.getFullYear());
  });
  var $next = $('<th class="next">❯</th>');
  $next.click(function() {
    d.setMonth(d.getMonth()+1);
    showMonth(d, $body);
    $month.html(months[d.getMonth()]+' '+d.getFullYear());
  });
  $row.append($prev);
  $row.append($month);
  $row.append($next);
  $head.append($row);

  // Add the day row
  $row = $('<tr class="days"></tr>');
  $row.append("<th>Man</th>");
  $row.append("<th>Tir</th>");
  $row.append("<th>Ons</th>");
  $row.append("<th>Tor</th>");
  $row.append("<th>Fre</th>");
  $row.append("<th>Lør</th>");
  $row.append("<th>Søn</th>");
  $head.append($row);


  showMonth(d, $body);

  return this;
};
}(jQuery));
