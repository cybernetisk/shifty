shifty.views.Index = Backbone.View.extend({
    events: {
    },

    initialize: function(options) {
        this.freeSm = options.freeSm;
  		this.freeBar = options.freeBar;
  		this.freeGuard = options.freeGuard;
  		this.freeDj = options.freeDj;
    },

    render: function() {
    	freeSm = this.freeSm.toJSON()[0].count;
        freeBar = this.freeBar.toJSON()[0].count;
        freeGuard = this.freeGuard.toJSON()[0].count;
        freeDj = this.freeDj.toJSON()[0].count;

        this.el.innerHTML = Handlebars.templates.index({ 
        						upcomingEvents: this.collection.toJSON(), 
        						freeSm: freeSm,
        						freeBar: freeBar,
        						freeGuard: freeGuard,
        						freeDj: freeDj,
        						freeAll: freeSm + freeBar + freeGuard + freeDj

        					});
        return this.el;
    }
});