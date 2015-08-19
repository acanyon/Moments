"use strict";

var CompositionView = Backbone.View.extend({

    events: {
        'click .close_modal': '_handle_close_modal',
        'click .heading .heading_option': '_handle_select_send_option',
        'click .submit_button': '_handle_submit_button',
    },

    initialize: function (options) {
        this._show_modal = options.show_modal;
        this._hide_modal = options.hide_modal;
    },

    render: function () {
        var template = _.template($('#tpl_composition_view').html());
        this.$el.html(template());
        this.$el.attr('selected_option', 'send');
    },

    show: function () {
        this.render();
        this._show_modal();
    },

    hide: function () {
        this._hide_modal();
    },

    _handle_close_modal: function (event) {
        this.hide();
    },

    _handle_select_send_option: function (event) {
        var $target = $(event.currentTarget);
        this.$el.attr('selected_option', $target.attr('option'));
    },

    _handle_submit_button: function (event) {
        console.log(' .... submitting ..... ');

        // TODO - add submit form

        this.hide();
    }

});


