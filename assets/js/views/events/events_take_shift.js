shifty.views.EventsTakeShift = Backbone.View.extend({
    // data: shiftElm
    // data: twinsData
    events: {
        'click .take_shift_button': 'saveState',

        // creating new users
        'typeahead:selected input.user_search': function(ev, sug, name)
        {
            $(this).data('existing', true);
        },
        'change input.user_search': function(e, datum)
        {
            $(this).data('existing', false);
        },
        'blur input.user_search': function(evt)
        {
            var obj = $(evt.currentTarget);
            var realname = obj.parents(".twin").find(".realname input").first();

            // ignore blanks
            if (obj.val() == "") {
                obj.data("volunteerId", null);
                realname.val("");
                return;
            }

            // don't run when modal is being closed
            if (!this.modal_active) return;

            // TODO: recheck for user if not exisiting
            // (it might be the loading failed or was cancelled if user was too fast typing)
            var existing = obj.data('existing') || obj.val() in this.known_users;
            if (!existing) {
                realname.val("");
                var usermodel = new shifty.models.NewUser({
                    'username': obj.val()
                });
                var userview = new shifty.views.EventsNewUser({
                    model: usermodel
                });
                userview.refField = obj;
                userview.parentModal = this.$el;
                userview.render();
            }

            else {
                realname.val(this.known_users[obj.val()][1]);
                obj.data("volunteerId", this.known_users[obj.val()][0]);
            }
        },

        'opened': function()
        {
            this.modal_active = true;
        },

        'closed': function()
        {
            // make sure 'blur'-event on typeahead-field doesn't open sub-modal
            this.modal_active = false;
        }
    },

    render: function()
    {
        this.setElement($(shifty.template("event_take_shift")(this.twinsData)));
        var self = this;

        // keep a list of known users to check later
        this.known_users = {};
        this.modal_active = true;

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
                    self.known_users = [];
                    $(data.results).each(function(i, node)
                    {
                        concat = node.first_name && node.last_name ? " " : "";
                        d.push({
                            value: node.username,
                            tokens: [node.username, node.first_name, node.last_name],
                            name: node.first_name + concat + node.last_name
                        });
                        self.known_users[node.username] = [node.id, node.first_name + " " + node.last_name];
                    });
                    return d;
                }
            }
        });
        
        remoteUsers.initialize();
        this.$('input.user_search').each(function(elm)
        {
            $(elm).data('existing', false);
        }).typeahead(null, {
            source: remoteUsers.ttAdapter(),
            templates: {
                suggestion: function(obj)
                {
                    return '<p>'+obj.value+(obj.name ? ' ('+obj.name+')' : '')+'</p>';
                }
            }
        })

        // show box
        $("body").append(this.$el);
        this.$el.foundation('reveal', 'open', {
            animation: 'fade',
            animation_speed: 100,
            close_on_backgroundClick: true,
            dismiss_modal_class: 'close-reveal-modal'
        });

        // focus to input field
        setTimeout(function(){ self.$("input.user_search.tt-input").first().focus(); }, 200);
    },

    saveState: function(e)
    {
        if (e) e.preventDefault();
        var elm = e.currentTarget;

        this.twinsData.shiftsCollection.each(function(shift)
        {
            var volunteer_id = $("[data-shift-id="+shift.get("id")+"] [name=name]").data("volunteerId") || null;
            var old = (shift.get("volunteer") && shift.get("volunteer").id) || null;

            if (old == volunteer_id)
                return;

            if (volunteer_id)
                console.log("changed user to", volunteer_id);

            else
                console.log("removed user", "old", old, "new", volunteer_id);

            shift.set("volunteer", volunteer_id);
            shift.set("comment", $("[data-shift-id="+shift.get("id")+"] [name=comment]").val());
            console.log("save", shift.save({
                "volunteer": volunteer_id,
                "comment": shift.get("comment")}, {patch:true}));
            console.log("chagned", shift.changedAttributes());
            console.log("attributes", shift.attributes);
        });

        //console.log("twins", this.twinsData);
    }
});
