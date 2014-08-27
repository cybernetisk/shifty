var shifty = {views: {}, models: {}, collections: {}};
moment.lang('nb');

var csrftoken = document.cookie.match(/csrftoken=(\w+)/);

if(csrftoken != null)
{
    $.ajaxSetup({
        headers: { 'X-CSRFToken': csrftoken[1] }
    });
}

shifty.template_cache = {};

shifty.template = function(id) {
    // Find the template element
    if (!shifty.template_cache[id]) {
        var tmp = document.querySelector('script.handlebars-template[data-id="'+id+'"]');
        if (!tmp) {
            console.error("Unknown template id:", id);
            return;
        }

        // Compile and cache the template
        shifty.template_cache[id] = Handlebars.compile(tmp.textContent);
    }

    // Return the compiled template
    return shifty.template_cache[id];
}

function ViewHandler(baseView) {
    var current;

    this.push = function(view, defers) {
        // Remove old view
        // TODO: if (current) current.clear();
        if (current) {
            $(baseView).empty();
        }
 
        current = view;
 
        if (!Array.isArray(defers)) defers = [defers];
        $.when.apply($, defers).done(function() {
            baseView.appendChild(view.render());
        }).fail(function() {
            console.error("Unable to load", arguments);
        });
    };
 
    this.clear = function() {
        if (current) {
            current.clear();
            current = undefined;
        }
    };
}

$(document).ready(function() {
    // admin menu
    (function() {
        var a;
        a = new shifty.views.AdminMenu();
        a.render();
    })();

    // router
    (function() {
        var shifty = window.shifty;
        var vh = new ViewHandler(document.getElementById("content"));

        shifty.Router = Backbone.Router.extend({
            routes: {
                '':       'index',
                'events': 'events',
                'event/:id': 'event'
            },

            index: function() {
                var e = new shifty.collections.Events();
                var s = new shifty.collections.Shifts();
                var count;

                $.ajax({
                    dataType: "json",
                    async: false,
                    url: "count_shifts",
                    success: function( data ) {
                        count = data;
                    }
                });

                var v = new shifty.views.Index({
                    collection: e,
                    urgent: s,
                    shift_counts: count
                });

                max = moment().add(8, 'days').format('YYYY-MM-DD');

                vh.push(v, 
                    e.fetch({ data: { page: 1, page_size: 5, min_date: 'today' }}),
                    s.fetch({ data: { page: 1, page_size: 5, min_date: 'today', max_date: max, 'volunteer': null }})
                );
            },

            events: function() {
                var c = new shifty.collections.Events();
                var v = new shifty.views.Events({
                    collection: c
                });
                vh.push(v, c.fetch({data: {min_date: 'today'}}));
            },

            event: function(id) {
                var m = new shifty.models.Event({id: id});

                m.fetch().done(function() {
                    m.shifts = new shifty.collections.Shifts(m.attributes.shifts);

                    var v = new shifty.views.Event({
                        model: m
                    });
                    vh.push(v);
                });                
            }
        });

        new shifty.Router();
        Backbone.history.start({pushState: true, hashState: false});
    })();

    // initialize foundation
    $(document).foundation();
});

// push local links through router
// TODO: This should probably be improved --henrste
$(document).on("click", "a:not([data-bypass])", function(evt) {
    var app = {root: ''};
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    var root = location.protocol + "//" + location.host + app.root;

    if (href.attr == "#") return;
    if (href.prop && href.prop.slice(0, root.length) === root) {
        evt.preventDefault();
        Backbone.history.navigate(href.attr, true);
    }
});
