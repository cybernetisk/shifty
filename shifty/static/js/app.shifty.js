moment.lang('nb');

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
        var v, a;
        v = new shifty.views.Popout();
        v.render();

        a = new shifty.views.AdminMenu();
        a.render();
    })();

    (function() {
        var shifty = window.shifty;
        var vh = new ViewHandler(document.getElementById("content"));

        shifty.Router = Backbone.Router.extend({
            routes: {
                '':       'index',
                'events': 'events'
            },

            index: function() {
                var v = new shifty.views.Index();
                vh.push(v, true);
            },

            events: function() {
                var c = new shifty.collections.Events();
                var v = new shifty.views.Events({
                    collection: c
                });
                vh.push(v, c.fetch());
            }
        });

        new shifty.Router();
        Backbone.history.start({pushState: true, hashState: false});
    })();
});

// push local links through router
$(document).on("click", "a:not([data-bypass])", function(evt) {
    var app = {root: ''};
    var href = { prop: $(this).prop("href"), attr: $(this).attr("href") };
    var root = location.protocol + "//" + location.host + app.root;

    if (href.prop && href.prop.slice(0, root.length) === root) {
        evt.preventDefault();
        Backbone.history.navigate(href.attr, true);
    }
});

// popup-box on events
$(document).ready(function() {   
    $(document).on("click", ".shift", function() {
        $("> .take_shift" ,this).foundation('reveal', 'open', {
            animation: 'fade',
            animationSpeed: 100,
            closeOnBackgroundClick: true,
            dismissModalClass: 'close-reveal-modal'
        });
    });
});