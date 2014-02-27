moment.lang('nb');

var csrftoken = document.cookie.match(/csrftoken=(\w+)/)[1];

$.ajaxSetup({
    headers: { 'X-CSRFToken': csrftoken }
});

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
    (function() {
        var a;
        a = new shifty.views.AdminMenu();
        a.render();
    })();

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
                var v = new shifty.views.Index({
                    collection: c
                });
                vh.push(v, c.fetch({ page: 1, page_size: 5 }));
            },

            events: function() {
                var c = new shifty.collections.Events();
                var v = new shifty.views.Events({
                    collection: c
                });
                vh.push(v, c.fetch());
            },

            event: function(id) {
                var m = new shifty.models.Event({id: id});

                m.fetch().done(function() {
                    m.shifts = new shifty.collections.Shift(m.attributes.shifts);

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