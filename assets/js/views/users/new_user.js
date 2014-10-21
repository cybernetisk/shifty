shifty.views.NewUser = Backbone.View.extend({
    events: {
        'click .create_user': 'createUser',
        // 'closed': function(a, b, c)
        // {
        //     var self = this;
        //     this.parentModal.foundation('reveal', 'open');
        //     setTimeout(function(){ self.refField.focus(); }, 200);
        // }
    },

    initialize:function(options){
        this.options = options;
    },

    render: function()
    {
        var self = this;
        var elm = $(shifty.template("new_user")());
        this.setElement(elm);
        elm.data('view', this);

        this.$el.foundation();
        this.$el.foundation('reveal', 'open', {
            animation: 'fade',
            animationSpeed: 100,
            closeOnBackgroundClick: true,
            dismissModalClass: 'close-reveal-modal'
        }).on('close', function () {
          self.options['on_close']()
        });


        var el = this.$el;
        setTimeout(function(){ el.find("input.field-name").first().focus(); }, 100);
    },

    createUser: function(e)
    {
        // TODO: check if username is in use as part of validation
        e.preventDefault();

        var username = this.$("input[name=username]").val();
        this.model = new shifty.models.NewUser()
        this.model.set('username', username);
        this.model.set('firstname', this.$("input[name=firstname]").val());
        this.model.set('lastname', this.$("input[name=lastname]").val());
        this.model.set('email', this.$("input[name=email]").val());
        this.model.set('phone', this.$("input[name=phone]").val());

        var self = this;
        this.model.save([], {
            success: function(model, response, options)
            {
                shifty.user = response['user'];
                self.options['on_close']();
            },
            error: function()
            {
                console.log("model save error");
            }
        });
        console.log("user-obj", this.model);
    }
});
