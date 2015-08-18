"use strict";

var CompositionView = Backbone.View.extend({

    events: {
    },

    initialize: function (options) {
    },

    render: function () {
        var template = _.template($('#tpl_composition_view').html());
        this.$el.html(template());
    },

});


