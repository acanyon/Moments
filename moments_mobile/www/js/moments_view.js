"use strict";

var MomentsView = Backbone.View.extend({

    events: {
        'touchstart .photos_container': '_handle_tstart_photos',
        'touchmove .photos_container': '_handle_tmove_photos',
        'touchend .photos_container': '_handle_tend_photos',
    },

    initialize: function (options) {
        this.moments_raw = options.data;
        this.scrollView = options.scrollView;
        this._focused_moment_id = undefined;

        this.render_moments(this.moments_raw);
        this.scrollView = new ScrollView(this.el); // scope me
        this.init_collapsable_header();
    },

    init_collapsable_header: function () {
        var _should_track_scroll = false;
        var _timeout = undefined;
        var adjust_collapsable_header = _.bind(function () {
            var $header = this.$('.header');
            if (this.scrollView.y < -80) {
                $header.addClass('collapsed');
            } else {
                $header.removeClass('collapsed');
            }
            if (_should_track_scroll) {
                _timeout = setTimeout(adjust_collapsable_header, 100);
            }
        }, this);
        this.scrollView.on('scrollStart', function () {
            _should_track_scroll = true;
            clearTimeout(_timeout);
            adjust_collapsable_header();

        });
        this.scrollView.on('scrollEnd', function () { _should_track_scroll = false; });
        this.scrollView.on('scrollCancel', function () { _should_track_scroll = false; });
    },


    render_moments: function (moments_raw) {
        var template = _.template($('#tpl_moment_single').html());
        var moments_html = _.map(moments_raw, function (moment_info) {
            return template({d: moment_info});
        }, this).join('');
        this.$('.container').append(moments_html);

        setTimeout(_.bind(function () {
            this.scrollView.refresh();
        }, this), 100);

        setTimeout(_.bind(function () {
            this.moment_focus(90);
        }, this), 1000);
    },

    moment_focus: function (moment_id) {
        this.$el.addClass('has_focused_moment');
        this._moment_blur();
        this.$focused_moment = this.$('.moment_single[data-id="' + moment_id +'"]');
        if (this.$focused_moment.length !== 1) {
            console.error('More than one match found.');
        }
        this.$focused_moment.addClass('focused');
        this.scrollView.setResistancePoint(this.$focused_moment[0], 100, _.bind(this.moment_blur, this));
    },

    moment_blur: function () {
        this.$el.removeClass('has_focused_moment');
        this._moment_blur();
    },

    _moment_blur: function () {
        if (this.$focused_moment) {
            this.$focused_moment.removeClass('focused');
            this.$focused_moment = undefined;
        }
    },

    _handle_tstart_photos: function (event) {
        if (event.originalEvent.touches.length === 1) {
            var touch = _.extend({}, event.originalEvent.touches[0]);
            this._scroll = {
                firstTouch: touch,
                canceled: false,
                has_locked_scroll: false,
            };
        }
    },

    _handle_tmove_photos: function (event) {
        var touch = _.extend({}, event.originalEvent.touches[0]);
        if (!this._scroll.canceled) {
            if (!this._scroll.has_locked_scroll) {
                event.stopPropagation();
                var diffX = Math.abs(this._scroll.firstTouch.clientX - touch.clientX);
                var diffY = Math.abs(this._scroll.firstTouch.clientY - touch.clientY);
                if (diffX > 20 || diffY > 20) {
                    if (diffY > diffX) {
                        this._scroll.canceled = true;
                    } else {
                        this.scrollView.lock();
                        this._scroll.has_locked_scroll = true;
                    }
                }
            } else {
                // todo default
            }
        }
    },

    _handle_tend_photos: function (event) {
        if (event.originalEvent.touches.length === 0) {
            // TODO
            this.scrollView.unlock();
        }
    },

    _clear_focused_moment: function (event) {
        this.moment_blur();
    },

});

