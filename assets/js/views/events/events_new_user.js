shifty.views.EventsNewUser = Backbone.View.extend({
    events: {
        'click .create_user': 'createUser',
        'closed': function()
        {
            var self = this;
            this.parentModal.foundation('reveal', 'open');
            setTimeout(function(){ self.refField.focus(); }, 200);
        }
    },

    render: function()
    {
        this.setElement($(Handlebars.templates.event_new_user({
            'username': this.model.get('username')
        })));

        this.$el.foundation();
        this.$el.foundation('reveal', 'open', {
            animation: 'fade',
            animationSpeed: 100,
            closeOnBackgroundClick: true,
            dismissModalClass: 'close-reveal-modal'
        });

        var el = this.$el;
        setTimeout(function(){ el.find("input.field-name").first().focus(); }, 100);
    },

    createUser: function(e)
    {
        // TODO: check if username is in use as part of validation
        e.preventDefault();

        var username = this.$("input[name=username]").val();
        this.model.set('username', username);
        this.model.set('firstname', this.$("input[name=firstname]").val());
        this.model.set('lastname', this.$("input[name=lastname]").val());
        this.model.set('email', this.$("input[name=email]").val());
        this.model.set('phone', this.$("input[name=phone]").val());

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
                console.log("model save error");
            }
        });
        console.log("user-obj", this.model);
    }
});
