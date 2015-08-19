"use strict";

var CompositionView = Backbone.View.extend({

    events: {
        'tap .close_modal': '_handle_close_modal',
        'tap .heading .heading_option': '_handle_select_send_option',
        'tap .submit_button': '_handle_submit_button',
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
        event.preventDefault(); event.stopPropagation();
        this.hide();
    },

    _handle_select_send_option: function (event) {
        event.preventDefault(); event.stopPropagation();
        var $target = $(event.currentTarget);
        this.$el.attr('selected_option', $target.attr('option'));
    },

    _handle_submit_button: function (event) {
        event.preventDefault(); event.stopPropagation();
        console.log(' .... submitting ..... ');

        // TODO - add submit form

        this.hide();
    }

});


