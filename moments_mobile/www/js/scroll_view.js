"use strict";

var ScrollView = Backbone.View.extend({

    events: {
        'touchstart': '_scrollstart',
        'touchmove': '_scrollmove',
        'touchend': '_scrollend',
    },

    initialize: function (options) {
        this.$wrapper = $(options.el);
        this.$scrollable = this.$wrapper.children();
        this.$scrollable.css({ top: 0, left: 0 });

        this.REFRESH_POS_FN = function (x) { return (-50/Math.pow(500, 2)) * Math.pow(x - 500, 2) + 50; };
    },

    lock: function () {
        this._is_locked = true;
    },

    unlock: function () {
        this._is_locked = false;
    },

    refresh: function () {
        // note: does not fully prevent two refreshes. race condition still exists
        // if animating when refresh is called
        // TODO - add _clearRefresh method
        clearTimeout(this._refresh_timeout);

        var REFRESH_INTERVAL = 50; // ms
        var NUM_RETRIES = 20;
        var _retry_count = NUM_RETRIES;
        var callback = _.bind(function (is_modified) {
            if (is_modified) {
                _retry_count = NUM_RETRIES;
                this._refresh(callback);
            } else if (_retry_count > -1) {
                _retry_count -= 1;
                clearTimeout(this._refresh_timeout);
                this._refresh_timeout = setTimeout(
                    _.bind(function () { this._refresh(callback); }, this),
                    REFRESH_INTERVAL);
            }
        }, this);

        this._refresh(callback);
    },

    track_anchor: function ($el) {
        this.$anchor = $el = $el || this.$anchor;
        clearTimeout(this._refresh_timeout); // also doesnt fully prevent race
        if (this.$anchor) {
            this._anchor_offset = _.extend({}, $el.offset());
        }
    },

    clear_anchor: function () {
        this.$anchor = undefined;
        this._anchor_offset = undefined;
    },

    set_anchor_offset: function (anchor_offset) {
        this._anchor_offset = _.extend(this._anchor_offset || {},  anchor_offset);
        this.refresh();
    },

    _refresh: function (callback) {
        var ANIMATION_DURATION = 50; //ms
        if (this.$anchor) {
            // TODO - add 'left' for consistancy
            if (this._anchor_offset.top !== this.$anchor.offset().top) {
                var deltaY = this._anchor_offset.top - this.$anchor.offset().top;
                if (deltaY > 10) { deltaY = deltaY / 3; }
                var css_top = this.$scrollable.position().top + deltaY;
                css_top = (css_top < 0 ? css_top : 0);
                this.$scrollable.animate({ top: css_top }, ANIMATION_DURATION,
                                         'swing',_.partial(callback, true));
            } else {
                callback(false);
            }
        }
    },

    _scrollstart: function (event) {
        this._is_scrolling = !this._is_locked;
        if (this._is_scrolling && event.originalEvent.touches.length === 1) {
            this._touches = [ this.copyTouch(event.originalEvent.touches[0]) ];
        }
    },

    _scrollmove: function (event) {
        if (this._is_scrolling) {
            var cur_touch = this.copyTouch(event.originalEvent.touches[0]);
            var prev_touch = this._touches[0];
            this._touches.unshift(cur_touch);
            
            var css_top = this.$scrollable.position().top + cur_touch.clientY - prev_touch.clientY;
            if (css_top < 0) {
                this.$scrollable.css({ top: css_top });
                setTimeout(_.bind(function() { this.track_anchor(); }, this));
            } else {
                var scrollY = (this.$scrollable.data('scrollY') || 0) + cur_touch.clientY - prev_touch.clientY;
                this.$scrollable.data({'scrollY': scrollY});
                this.$scrollable.css({ top: this.REFRESH_POS_FN(scrollY) });
            }
        }
    },

    _scrollend: function (event) {
        if (this._is_scrolling && event.originalEvent.touches.length === 0) {
            this._touches = undefined;
            this.$scrollable.data({'scrollY': ''});
            if (this.$scrollable.position().top > 0) {
                this.$scrollable.animate({top: 0}, {easing: 'easeOutQuad', duration: 150});
            }
        }
        this._is_scrolling = undefined;
    },

    copyTouch: function (touch) {
        return {
            clientY: touch.clientY,
            clientX: touch.clientX
        };
    }

});
//_.extend(ScrollView, Backbone.Events);

