"use strict";

var CompositionView = Backbone.View.extend({

    events: {
        'tap .close_modal': '_handle_close_modal',
        'tap .heading .heading_option': '_handle_select_send_option',
        'tap .submit_button': '_handle_submit_button',
        'tap .section.to_wrapper': '_handle_to_input_focus',
        'tap .section.caption_wrapper': '_handle_caption_focus',
        'tap .photos .add_photo': '_handle_add_photo_click',
    },

    initialize: function (options) {
        this._show_modal = options.show_modal;
        this._hide_modal = options.hide_modal;
        this.photos = [];
        this.$el.on('tap click', this._stop_propagation);
        window.addEventListener('native.keyboardshow', _.bind(this._handle_keyboard_show, this));
        window.addEventListener('native.keyboardhide', _.bind(this._handle_keyboard_hide, this));
    },

    render: function () {
        var template = _.template($('#tpl_composition_view').html());
        this.$el.html(template());
        this.$el.attr('selected_option', 'send');
        setTimeout(_.bind(this._adjust_element_size, this));
    },

    _handle_add_photo_click: function (event) {
        navigator.camera.getPicture(_.bind(this.onCaptureSuccess, this), _.bind(this.onCaptureFail, this), {
                allowEdit: true,
                correctOrientation: true,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                targetHeight: 315,
                targetWidth: 320
        });
    },

    onCaptureSuccess: function (arg1) {
        this.photos.push(arg1);
        this.$('.photos').prepend('<div class="photo" style="background-image:url(' + arg1 + ');"></div>');
    },

    onCaptureFail: function () {
        debugger;
    },


    show: function () {
        this.render();
        this._show_modal();
    },

    hide: function () {
        this._hide_modal();
    },

    _handle_keyboard_hide: function (event) {
        this._hide_keyboard_timeout = setTimeout(_.bind(function () {
            this.$el.removeClass('keyboard_visible');
        }, this), 50);
    },

    _handle_keyboard_show: function (event) {
        clearTimeout(this._hide_keyboard_timeout);
        this.keyboard_height = event.keyboardHeight;
        var margin_top = this.$el.hasClass('keyboard_visible') ? 20 : 0;
        this.$el.addClass('keyboard_visible');
    },

    _focus_input: function ($input) {
        this.$focused_input = $input;
        this.$focused_input.focus();
        cordova.plugins.Keyboard.disableScroll(true);
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
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
        this._focus_input($(event.currentTarget).find('input'));
    },

    _handle_caption_focus: function (event) {
        this._stop_propagation(event);
        this._focus_input($(event.currentTarget).find('textarea'));
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


