var Popout = Backbone.View.extend({
    el: $('<div id="popout" class="popout"></div>'),
    // template which has the placeholder 'who' to be substitute later 
    initialize: function(){
        $(document).append(this.el);
    },
    render: function(){
        this.$el.html();
    }
});
