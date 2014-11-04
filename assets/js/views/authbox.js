shifty.views.Authbox = Backbone.View.extend({
    tagName:'div',
    events:{
        'click .login':'login',
        'click .logout':'logout'
    },
    initialize:function(){
        this.$el = $("#authbox");
        this.el = this.$el[0];
        var self = this;
        shifty.events.on('refresh', function(){self.render();});
    },
    render: function(){
        is_logged_in = shifty.user != undefined;
        var html = shifty.template("authbox")({'is_logged_in':is_logged_in});
        return this.$el.html(html);
    },
    login:function(){
        var self = this;
        var login = new shifty.views.Login({'after_success':function(){
                    self.render();
                }});
        login.render();
    },
    logout:function(){
        var self = this;
        shifty.user = undefined;
        $.get('/logout').done(function(){
            self.render();
            shifty.events.trigger('refresh');
        });

        shifty.events.trigger('logout');
        
    }
});
