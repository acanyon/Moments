"use strict";

var SigninFlow = Backbone.View.extend({

    events: {
        'tap .page .button.page_back': '_handle_page_back',
        'tap .page .cancel_signup': '_handle_signup_reset',
        'tap .page[page="login_signup"] .button': '_handle_login_signup_button',
        'tap .page[page="login"] .button_primary': '_handle_login_attempt',
        'tap .page[page="signup_1"] .button_primary': '_handle_newuser_email_submit',
        'tap .page[page="signup_2"] .button_primary': '_handle_verify_phone_submit',
    },

    initialize: function (options) {
        this._authenticity_token = options.authenticity_token;
        this._page = {};
    },

    render: function () {
        var template = _.template($('#tpl_login_flow').html());
        this.$el.html(template());
        this.$el.find('.page').addClass('hidden').first().removeClass('hidden');
        this.$selected_page = this.$el.find('.page').first();
        this.$selected_page.removeClass('hidden');
        this.$el.find('input[name="authenticity_token"]').attr('value', this._authenticity_token);
        this._authenticity_token = undefined;
    },

    focus_page: function (name, is_behind) {
        var $new_page = this.$('.page[page="' + name + '"]');
        var $old_page = this.$selected_page;
        this.$prev_page = $old_page;
        this.$selected_page = $new_page;

        if (is_behind) {
            $new_page.removeClass('hidden');
            $old_page.css('z-index', 10)
                .animate({ left: '100%' }, 200, 'linear', function () {
                    $old_page.css('z-index', '').addClass('hidden');
                    $old_page.css('left', '');
                });
        } else {
            $new_page.css('z-index', 10)
                .animate({ left: '0' }, 200, 'linear', function () {
                    $new_page.removeClass('hidden');
                    $old_page.addClass('hidden');
                    $new_page.css('left', '');
                });
        }
    },

    close_signin_flow: function () {
        this.focus_page('', true);
        this.trigger('signin_flow_closed');
    },

    _handle_page_back: function (event) {
        this.focus_page(this.$prev_page.attr('page'), true);
    },

    _handle_signup_reset: function (event) {
        this.focus_page($(event.currentTarget).attr('destination'), true);
    },

    _handle_login_attempt: function (event) {
        var $form = $(event.currentTarget).closest('form');
        $.post(window.moments_api_url + $form.attr('action'), $form.serialize())
            .done(_.bind(function (response) {
                debugger;

                this.close_signin_flow();
            }, this))
            .fail(_.bind(function (response) {
                debugger;
            }, this));
    },

    _handle_login_signup_button: function (event) {
        this.focus_page($(event.currentTarget).attr('destination'), false);
    },

    _handle_newuser_email_submit: function (event) {
        this.focus_page($(event.currentTarget).attr('destination'), false);
    },

    _handle_verify_phone_submit: function (event) {
        this.close_signin_flow();
    },

});


