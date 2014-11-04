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
    initialized: function(){
        shifty.events.on('logout', function(){self.$el.foundation('reveal', 'close');});
    },
    render: function()
    {
        this.setElement($(shifty.template("event_take_shift")(this.twinsData)));
        var self = this;

        // keep a list of known users to check later
        this.known_users = {};
        this.modal_active = true;

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
        var self = this;

        var shift_id = $(elm).data('shift-id')
        $.post('/take_shift', {'shift_id':shift_id})
            .success(function(result){
                if(result['status'] == 'taken')
                {
                    alert("oh no! somebody took the shift ahead of you... We have to reload the page!");
                    self.$el.foundation('reveal', 'close');
                    if(self.on_update != undefined)
                        self.on_update();
                }
                else if(result['status'] == 'collides')
                {
                    alert("This shift collides with another shift you have... (" + result['desc'] + ")");
                }
                else if(result['status'] == 'ok')
                {
                    self.$el.foundation('reveal', 'close');
                    if(self.on_update != undefined)
                    {
                        self.on_update();
                    }
                }
            });
    }
});
