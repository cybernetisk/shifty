shifty.views.Login = Backbone.View.extend({
    // data: shiftElm
    // data: twinsData
    initialize:function(args){
        $(this.el).data('view', this);
        $(this).data('args', args)
    },
    events: {
        'click .login': 'login',
        'click .new_user': 'new_user',

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
        var elm = $(shifty.template("login")(this.twinsData));
        this.setElement(elm);
        elm.data('view', this);

        var self = this;

        // show box
        $("body").append(this.$el);
        this.$el.foundation('reveal', 'open', {
            animation: 'fade',
            animation_speed: 100,
            close_on_backgroundClick: true,
            dismiss_modal_class: 'close-reveal-modal'
        });
    },

    login: function(e)
    {
        var tmp = new shifty.models.User();

        var username = this.$("input[name=username]").val();
        var password = this.$("input[name=password]").val();

        var self = this;
        tmp.login(username, password,
            function(e){self.success(e);}, 
            function(e){self.failed(e);}
            );
        e.preventDefault();
    },

    success: function(e)
    {
        var args = $(this).data('args');
        args['after_success']()
    },

    failed: function(e)
    {
        console.log(this);
    },

    new_user: function(e)
    {
        var self = this;
        var parentView = this.parentView;

        var new_user = new shifty.views.NewUser({
                'on_close':
                    function(){
                        self.success();
                    }
            });
        new_user.render();
    }
});
