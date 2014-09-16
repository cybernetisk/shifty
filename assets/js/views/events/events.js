shifty.views.Events = Backbone.View.extend({
    tagName: "div",
    id: "events",

    events: {
        'click .view_shifts_columns': 'columnsView',
        'click .view_shifts_table': 'tableView'
    },

    initialize: function(el) {
        // TODO: pagination links and handling
        /*var limit = 5;
        var offset = 1;

        this.eventViews = [];
        this.limit = 5;
        this.offset = 1;*/
    },

    render: function() {
        this.$el.html(shifty.template("events")());
        this.sub = this.$(".events_wrap");
        this.columnsView();
        return this.el;
    },

    columnsView: function(e)
    {
        if (e) e.preventDefault();
        this.genView(shifty.views.EventColumned);
    },

    tableView: function(e)
    {
        if (e) e.preventDefault();
        this.genView(shifty.views.EventTable);
    },

    genView: function(viewModel)
    {
        this.sub.empty();
        this.collection.each(function(ev) {
            var v = new viewModel({model: ev});
            v.parentView = this;
            this.sub.append(v.render());
        }.bind(this));
    },

    loginBox: function(after_success)
    {
        var login = new shifty.views.Login({'after_success':after_success});
        login.parentView = this;
        login.render();
    },

    takeShiftBox: function(shiftElm, twinsData)
    {
        if(shifty.state.user == undefined)
        {
            var self = this;
            var after_success = function(){
                self.takeShiftBox(shiftElm, twinsData);
            }
            this.loginBox(after_success);
        }
        else
        {
            var takeshift = new shifty.views.EventsTakeShift();
            takeshift.shiftElm = shiftElm;
            takeshift.twinsData = twinsData;
            takeshift.refView = this;
            takeshift.render();
        }
    }
});
