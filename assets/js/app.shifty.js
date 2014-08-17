var shifty = {views: {}, models: {}, collections: {}};
moment.lang('nb');

var csrftoken = document.cookie.match(/csrftoken=(\w+)/);

if(csrftoken != null)
{
    $.ajaxSetup({
        headers: { 'X-CSRFToken': csrftoken[1] }
    });
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
                var c = new shifty.collections.Events();
                var count;

                $.ajaxSetup( { "async": false } );
                var count = $.getJSON( "count_shifts", function(data) {
                        count = data;
                        console.log("ja", data.bar);
                });

                var v = new shifty.views.Index({
                    collection: c,
                    shift_counts: count
                });


                vh.push(v, 
                    c.fetch({ data: { page: 1, page_size: 5, min_date: 'today' }})
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