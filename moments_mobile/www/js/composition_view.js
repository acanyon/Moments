"use strict";

var CompositionView = Backbone.View.extend({

    events: {
        'tap .close_modal': '_handle_close_modal',
        'tap .heading .heading_option': '_handle_select_send_option',
        'tap .submit_button': '_handle_submit_button',
        'tap .section.to_wrapper': '_handle_to_input_focus',
        'tap .section.caption_wrapper': '_handle_caption_focus',
    },

    initialize: function (options) {
        this._show_modal = options.show_modal;
        this._hide_modal = options.hide_modal;
        this.$el.on('tap click', this._stop_propagation);
    },

    render: function () {
        var template = _.template($('#tpl_composition_view').html());
        this.$el.html(template());
        this.$el.attr('selected_option', 'send');
        setTimeout(_.bind(this._adjust_element_size, this));
    },

    show: function () {
        this.render();
        this._show_modal();
    },

    hide: function () {
        this._hide_modal();
    },

    _adjust_element_size: function () {
        var margin_top = 20; // px - should match marign top of wrapper
        var submit_height = 60; // px
        var window_height = $(window).height();
        var $wrapper = this.$('.wrapper');

        $wrapper.height(window_height - submit_height - margin_top);
    },

    _handle_to_input_focus: function (event) {
        this._stop_propagation(event);
        $(event.currentTarget).find('input').focus();
    },

    _handle_caption_focus: function (event) {
        this._stop_propagation(event);
        $(event.currentTarget).find('textarea').focus();
    },

    _handle_close_modal: function (event) {
        this._stop_propagation(event);
        this.hide();
    },

    _handle_select_send_option: function (event) {
        this._stop_propagation(event);
        var $target = $(event.currentTarget);
        this.$el.attr('selected_option', $target.attr('option'));
    },

    _handle_submit_button: function (event) {
        this._stop_propagation(event);
        console.log(' .... submitting ..... ');

        // TODO - add submit form

        this.hide();
    },

    _stop_propagation: function (event) {
        event.preventDefault(); event.stopPropagation();
    }

});


