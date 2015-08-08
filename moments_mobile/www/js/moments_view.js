"use strict";

var MomentsView = Backbone.View.extend({

    events: {
        'touchstart .photos_container': '_handle_tstart_photos',
        'touchmove .photos_container': '_handle_tmove_photos',
        'touchend .photos_container': '_handle_tend_photos',
    },

    _handle_tstart_photos: function (event) {
        this.track_photo_touch(event.originalEvent);
    },

    _handle_tmove_photos: function (event) {
        this.pan_photo_view($(event.currentTarget), event.originalEvent);
    },

    _handle_tend_photos: function (event) {
        this.clear_photo_touch();

        var $target = $(event.currentTarget);
        var $visible = $target.find('.visible.single_photo').last();
        var $animating = $target.find('.animating.single_photo');
        var visible_shown = $visible.offset().left + $visible.width();
        var animating_shown = $animating.length ? ($animating.offset().left + $animating.width() - visible_shown) : -1;

        if (visible_shown > animating_shown) {
            $animating.removeClass('animating');
            var new_width = $visible.offset().left + $visible.width() - $target.offset().left;
            if ($target.width() !== new_width) {
                $target.animate({width: new_width});
            }
        } else {
            var new_width = $visible.offset().left + $visible.width() + $target.width();
            $target.animate({width: new_width}, 400);
            var that = this;
            setTimeout(function () {
                that.set_photo_visible($animating);
            });
        }
    },

    set_photo_visible: function ($photo) {
        if (!$photo.hasClass('visible')) {
            var $container = $photo.closest('.photos_container');
            var $last_visible = $container.find('.visible.single_photo').last();
            var new_left = $last_visible.position().left + $last_visible.width() + 5;
            $photo.css({'left': new_left}).addClass('visible').removeClass('animating');
        }
    },

    clear_photo_touch: function () {
        this._last_touch = undefined;
    },

    track_photo_touch: function (touchevent) {
        this._last_touch = { clientX: touchevent.touches[0].clientX };
    },

    pan_photo_view: function ($target, touchevent) {
        var touch = touchevent.touches[0];
        var deltaX = this._last_touch.clientX - touch.clientX;

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

    initialize: function (options) {
        this.moments_raw = options.data;
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
    },

    render_moment: function (moment_info) {
        var template = _.template($('#tpl_moment_single').html());
        return template({d: moment_info});
    }

});


