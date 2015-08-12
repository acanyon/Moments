"use strict";

var MomentsView = Backbone.View.extend({

    events: {
        'touchstart .photos_container': '_handle_tstart_photos',
        'touchmove .photos_container': '_handle_tmove_photos',
        'touchend .photos_container': '_handle_tend_photos',
        'click .moment_single:not(.focused)': '_clear_focused_moment',
    },

    initialize: function (options) {
        this.moments_raw = options.data;
        this.lock_bodyscroll = options.lock_bodyscroll;
        this.unlock_bodyscroll = options.unlock_bodyscroll;

        this._focused_moment_id = undefined;
        this.PAN_CLIENTX_THREASHHOLD = 15; // px

    },

    render: function () {
        var moments_html = _.map(this.moments_raw, function (moment_raw) {
            return this.render_moment(moment_raw);
        }, this).join('');
        this.$el.html(moments_html);

        var $photos_container = this.$('.photos_container');
        $photos_container.width($photos_container.parent().innerWidth());
        $photos_container.find('.single_photo:first-child').addClass('visible');
        $photos_container.each(function (a,cell) {
            var $cell = $(cell);
            $cell.find('.single_photo').each(function (i, photo) {
                $(photo).css('z-index', $cell.length - i + 1);
                $(photo).data('id', i);
            });
        });
        this.$el.closest('.scrollable_body').on('scroll',
                _.bind(this._handle_body_scroll, this));
    },

    render_moment: function (moment_info) {
        var template = _.template($('#tpl_moment_single').html());
        return template({d: moment_info});
    },

    set_photo_visible: function ($photo) {
        if (!$photo.hasClass('visible')) {
            var $container = $photo.closest('.photos_container');
            var $last_visible = $container.find('.visible.single_photo').last();
            var new_left = $last_visible.position().left + $last_visible.width() + 5;
            $photo.css({'left': new_left}).addClass('visible').removeClass('animating');
        }
    },

    set_focused_photo: function ($photo) {
        this.set_focused_moment(this.get_moment_id($photo));
        this.$('.single_photo.focused').removeClass('focused');
        $photo.addClass('focused');
        var $photo_container = $photo.closest('.photos_window');
        $photo_container.height($photo.height());
        // TODO - check bounds to see if in view, else scroll
    },

    clear_photo_touch: function () {
        this._prev_touch = undefined;
        this._first_touch = undefined;
    },

    track_photo_touch: function (touchevent) {
        this._prev_touch = { clientX: touchevent.touches[0].clientX };
        if (!this._first_touch) {
            this._first_touch = { clientX: touchevent.touches[0].clientX };
        }
    },

    pan_photo_view: function ($target, touchevent) {
        var touch = touchevent.touches[0];
        var deltaX = this._prev_touch.clientX - touch.clientX;

        var $animating = $target.find('.animating.single_photo');
        var $focused = $target.find('.visible.single_photo').last();
        var $all_photos = $target.find('.single_photo');

        if (deltaX > 0) { // opening
            var right_edge = $focused.offset().left + $focused.width();
            if (right_edge + deltaX < 300) {
                $target.find('.single_photo:not(.visible)').first().addClass('animating');
            }
            if (right_edge + deltaX < 16) {
                this.set_photo_visible($animating.first());
            }
        } else {
            var right_edge = $focused.offset().left + $focused.width();
            if (right_edge + deltaX > 100 && $animating.length < 1 && !$all_photos.first().is($focused)) {
                $focused.removeClass('visible').addClass('animating');
            }
            if (right_edge + deltaX > 300) {
                $animating.removeClass('animating');
            }
        }

        $target.width($target.width() + deltaX);
        this.track_photo_touch(touchevent);
    },

    snap_photo_view: function ($photo_container) {
        var $visible = $photo_container.find('.visible.single_photo').last();
        var $animating = $photo_container.find('.animating.single_photo');
        var visible_shown = $visible.offset().left + $visible.width();
        var animating_shown = $animating.length ? ($animating.offset().left + $animating.width() - visible_shown) : -1;

        if (visible_shown > animating_shown) {
            this.set_focused_photo($visible);
            $animating.removeClass('animating');
            var new_width = $visible.offset().left + $visible.width() - $photo_container.offset().left;
            if ($photo_container.width() !== new_width) {
                $photo_container.animate({width: new_width});
            }
        } else {
            var new_width = $visible.offset().left + $visible.width() + $photo_container.width();
            this.set_focused_photo($animating);
            $photo_container.animate({width: new_width}, 400);
            setTimeout(_.bind(function () {
                this.set_photo_visible($animating);
            }, this));
        }
    },

    get_moment_id: function ($target) {
        return $target.closest('.moment_single').data('id');
    },

    set_focused_moment: function (moment_id) {
        this.clear_focused_moment();
        this._focused_moment_id = moment_id;
        this.$el.addClass('has_focused_moment');
        this.$('.moment_single[data-id=' + moment_id + ']').addClass('focused');
    },

    clear_focused_moment: function (moment_id) {
        this._focused_moment_id = undefined;
        this.$el.removeClass('has_focused_moment');
        var $focused_moment = this.$('.moment_single.focused');
        $focused_moment.removeClass('focused');
        this.$('.photos_window').css('height', '');
    },

    _handle_tstart_photos: function (event) {
        if (event.originalEvent.touches.length === 1) {
            console.log('touchstart');
            var moment_id = this.get_moment_id($(event.currentTarget));
            if (this._focused_moment_id === moment_id || this._focused_moment_id === undefined) {
                this.track_photo_touch(event.originalEvent);
            }
        }
    },

    _handle_tmove_photos: function (event) {
        var $target = $(event.currentTarget);
        var moment_id = this.get_moment_id($target);

        var pan_valid_moment = (this._focused_moment_id === moment_id || this._focused_moment_id === undefined);
        if (pan_valid_moment && this._first_touch) {
            this.pan_photo_view($target, event.originalEvent);

            var deltaX = Math.abs(this._first_touch.clientX - this._prev_touch.clientX);
            if (deltaX > this.PAN_CLIENTX_THREASHHOLD) {
                this.lock_bodyscroll();
                if (this._focused_moment_id === undefined) {
                    this.set_focused_moment(moment_id);
                }
            }
        }
    },

    _handle_tend_photos: function (event) {
        if (event.originalEvent.touches.length === 0) {
            var $target = $(event.currentTarget);
            var moment_id = this.get_moment_id($target);
            var should_snap_photoview = (this._focused_moment_id === moment_id || this._focused_moment_id === undefined);
            should_snap_photoview = (should_snap_photoview && this._first_touch);

            this.clear_photo_touch();
            this.unlock_bodyscroll();

            if (should_snap_photoview) {
                this.snap_photo_view($(event.currentTarget));
            }
        }
    },

    _clear_focused_moment: function (event) {
        this.clear_focused_moment();
    },

    _handle_body_scroll: function (event) {
        var $target = $(event.currentTarget);
        if (!this._last_scroll || this._last_scroll.timestamp + 1000 < Date.now()) {
            this._last_scroll = {
                timestamp: Date.now(),
                scrollTop: $target.scrollTop()
            };
            console.log(this._last_scroll);
        }

        if (Math.abs($target.scrollTop() - this._last_scroll.scrollTop) > 50) {
            this.clear_focused_moment();
        }
    },

});

