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
        this.$el.html(Handlebars.templates.events());
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

    takeShiftBox: function(wrap, block)
    {
        //wrap.html(Handlebars.templates.event_take_shift(block));
        //var modal = el.find(".take_shift");
        var modal = $(Handlebars.templates.event_take_shift(block));

        // keep a list of known users to check later
        var known_users = {};

        // autocomplete users
        var remoteUsers = new Bloodhound({
            name: 'user',
            datumTokenizer: function(d)
            {
                return Bloodhound.tokenizers.whitespace(d.value);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                url: '/rest/user/?search=%QUERY',
                filter: function(data)
                {
                    var d = [];
                    known_users = [];
                    $(data.results).each(function(i, node)
                    {
                        concat = node.first_name && node.last_name ? " " : "";
                        d.push({
                            value: node.username,
                            tokens: [node.username, node.first_name, node.last_name],
                            name: node.first_name + concat + node.last_name
                        });
                        known_users[node.username] = node.first_name + " " + node.last_name;
                    });
                    /*d.push({
                        value: 'Opprett ny bruker',
                        tokens: [],
                        name: 'create-new-user'
                    });*/
                    return d;
                }
            }
        });

        var modal_active = true;

        remoteUsers.initialize();
        modal.find('input.user_search').each(function(elm)
        {
            $(elm).data('existing', false);
        });
        modal.find('input.user_search').typeahead(null, {
            //displayKey: 'value',
            source: remoteUsers.ttAdapter(),
            templates: {
                suggestion: function(obj)
                {
                    //return '<p>'+obj.value+(obj.name && obj.name != 'create-new-user' ? ' ('+obj.name+')' : '')+'</p>';
                    return '<p>'+obj.value+(obj.name ? ' ('+obj.name+')' : '')+'</p>';
                }
            }
        })

        // creating new users
        .on('typeahead:selected', function(ev, sug, name)
        {
            $(this).data('existing', true);
            console.log("typeahead:selected", sug);
        }).on('change', function(e, datum)
        {
            $(this).data('existing', false);
            console.log("typeahead-change", e, datum);
        }).on('blur', function(evt)
        {
            var realname = $(this).parents(".twin").find(".realname input").first();

            // ignore blanks
            if ($(this).val() == "") {
                realname.val("");
                return;
            }

            // don't run when modal is being closed
            if (!modal_active) return;

            // TODO: recheck for user if not exisiting
            // (it might be the loading failed or was cancelled if user was too fast typing)

            var existing = $(this).data('existing') || $(this).val() in known_users;
            if (!existing) {
                realname.val("");
                var usermodel = new shifty.models.NewUser({
                    'username': $(this).val()
                });
                var userview = new shifty.views.EventsNewUser({
                    model: usermodel
                });
                userview.refField = $(this);
                userview.parentModal = modal;
                userview.render();
            }

            else {
                realname.val(known_users[$(this).val()]);
            }
        })

        // show box
        $("body").append(modal);
        modal.foundation('reveal', 'open', {
            animation: 'fade',
            animation_speed: 100,
            close_on_backgroundClick: true,
            dismiss_modal_class: 'close-reveal-modal'/*,
            css: {
                open: {
                    'top': wrap.parents('.event,.event_list').offset().top
                }
            }*/
        }).on('opened', function()
        {
            modal_active = true;
            /*$('html, body').animate({
                scrollTop: modal.offset().top-20
            });*/
        }).on('closed', function()
        {
            modal_active = false; // make sure 'blur'-event on typeahead-field doesn't open sub-modal
        });

        setTimeout(function(){ modal.find("input.user_search.tt-input").first().focus(); }, 200);
    }
});

shifty.views.EventsNewUser = Backbone.View.extend({
    events: {
        'click .create_user': 'createUser'
    },

    render: function()
    {
        var d = $(Handlebars.templates.event_new_user({
            'username': this.model.get('username')
        }));

        d.foundation();
        d.foundation('reveal', 'open', {
            animation: 'fade',
            animationSpeed: 100,
            closeOnBackgroundClick: true,
            dismissModalClass: 'close-reveal-modal'
        }).on('closed', function()
        {
            this.parentModal.foundation('reveal', 'open');
            setTimeout(function(){ this.refField.focus(); }.bind(this), 200);
        }.bind(this));

        this.el = d;

        // TODO: check if username is in use as part of validation

        d.find(".create_user").on('click', this.createUser.bind(this));
        setTimeout(function(){ d.find("input.field-name").first().focus(); }, 100);
    },

    createUser: function(e)
    {
        e.preventDefault();

        var username = this.el.find("input[name=username]").val();
        this.model.set('username', username);
        this.model.set('firstname', this.el.find("input[name=firstname]").val());
        this.model.set('lastname', this.el.find("input[name=lastname]").val());
        this.model.set('email', this.el.find("input[name=email]").val());
        this.model.set('phone', this.el.find("input[name=phone]").val());

        var self = this;
        this.model.save([], {
            success: function(model, response, options)
            {
                console.log("success", self);
                self.refField.val(username);
                self.refField.data('existing', true);
                self.el.foundation('reveal', 'close');
                console.log(self.refField.parents(".twin").find(".comment input").first());
                setTimeout(function(){ self.refField.parent(".twin").find(".comment input").focus(); }, 200);
            },
            error: function()
            {
                console.log("error");
                console.log("model save error");
            }
        });
        console.log("user-obj", this.model);
    }
});

shifty.views.EventTable = Backbone.View.extend({
    parentView: null,
    events: {
        'click .shift': 'takeShift'
    },

    render: function()
    {
        return this.$el.html(Handlebars.templates.event_list(this.model.toJSON()));
    },

    takeShift: function(ev)
    {
        // fint the shift element
        var obj = $(ev.currentTarget);
        if (!obj.hasClass("shift")) obj = obj.parent(".shift");

        // find data for this block
        var shift_id = obj.attr('id').substring(6);
        console.log("takeShift", this);

        var data = this.model.shifts.get(shift_id).attributes;
        var block = {
            'event': this.model.attributes,
            'shift': data,
            'cssClass': data.shift_type.title.toLowerCase(),
            'twins': [data],
            'twinsCount': 1,
            'hasTwins': false
        };

        // generate take shift-box
        block = $.extend(block, {'event': this.model.toJSON()});
        this.parentView.takeShiftBox(obj, block);
    }
});

shifty.views.EventColumned = Backbone.View.extend({
    events: {
        'click .shift': 'takeShift'
    },

    initialize: function(el) {

    },

    render: function() {

        this.el.innerHTML = Handlebars.templates.event_columned({
            'event': this.model.toJSON(),
            'columns': this.getShiftColumns()
        });

        return this.el;
    },

    takeShift: function(ev)
    {
        // fint the shift element
        var obj = $(ev.currentTarget);
        if (!obj.hasClass("shift")) obj = obj.parent(".shift");

        // find data for this block
        var shift_id = obj.attr('id').substring(6);
        var block = this.grouplinks[shift_id];

        // generate take shift-box
        block = $.extend(block, {'event': this.model.toJSON()});
        this.parentView.takeShiftBox(obj, block);
    },

    /**
     * Structure data to be used in columns
     */
    getShiftColumns: function()
    {
        var columns = [];
        //var shifts = this.model.get('shifts').sort(this.sortByShiftType);
        var shifts = this.model.shifts;

        var rowIndex = 0;
        var colIndex = -1;
        var twinCount = 0;
        var twins = [];

        var self = this;
        var i = -1;
        var available = false;
        this.grouplinks = {};
        shifts.each(function(shift)
        {
            i++;
            if (rowIndex === 0)
            {
                columns.push([]);
                colIndex++;
            }

            // shift.start = ... _date(self.start, "H:i")
            // shift.stop = ... _date(self.stop, "H:i")
            var data = shift.attributes;
            var cssClass = data.shift_type.title.toLowerCase();

            // the following shift
            var next = (i < shifts.models.length ? shifts.models[i+1] : null);
            twins.push(data);
            if (!data.volunteer) available = true;

            // add the shift to the active column if it has no next or next is no twin
            if (!next || !shift.isTwin(next))
            {
                columns[colIndex].push({
                    'shift': data,
                    'cssClass': cssClass,
                    'twins': twins,
                    'twinsCount': twins.length,
                    'hasTwins': twins.length > 1,
                    'available': available
                });
                self.grouplinks[data.id] = columns[colIndex][columns[colIndex].length-1];
                twins = [];
                available = false;

                rowIndex = (data.durationType == 'long' ? 0 : rowIndex + 1);
                if (next && data.shift_type.title != next.attributes.shift_type.title)
                {
                    rowIndex = 0;
                }
            }
        });

        return columns;
    }
});
