"use strict";

var ScrollView = function (el, options) {
    // init scroll view
    options = {
//        preventDefault: false,
 //       mouseWheel: true,
  //      keyBindings: true,
    };
    _.bind(IScroll, this)(el, options);
};

ScrollView.prototype = _.extend({}, IScroll.prototype, {
    lock: function () {
        $(this.wrapper).css({'overflow': 'hidden'});
        this.disable()
    },

    unlock: function () {
        $(this.wrapper).css({'overflow': ''});
        this.enable();
    },

});









var ScrollViewOld = Backbone.View.extend({

    events: {
        'touchstart': '_scrollstart',
        'touchmove': '_scrollmove',
        'touchend': '_scrollend',
        // 'touchcancel': '_scrollcancel',
    },

    initialize: function (options) {
        this.$wrapper = $(options.el);
        this.$scrollable = this.$wrapper.children();
        this.$scrollable.css({ top: 0, left: 0 });
    },

    lock: function () {
        this._is_locked = true;
        if (this._is_scrolling) {
            this._is_scrolling = false;
        }
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
//                this.$scrollable.animate({ top: css_top }, ANIMATION_DURATION,
//                                         'swing',_.partial(callback, true));
                this._animate_to_position(css_top);
            } else {
                callback(false);
            }
        }
    },

    _scrollstart: function (event) {
        this._is_scrolling = !this._is_locked;
        if (this._is_scrolling && event.originalEvent.touches.length === 1) {
            var cur_touch = this.copyTouch(event.originalEvent.touches[0]);
            clearTimeout(this._scroll && this._scroll.ticker);

            var track_move = _.bind(function () {
                var now, elapsed, delta, v;
                     
                now = Date.now();
                elapsed = now - this._scroll.timestamp;
                this._scroll.timestamp = now;
                delta = this._scroll.cur_touch.clientY - this._scroll.frame;
                this._scroll.frame = this._scroll.cur_touch.clientY;

                v = 1000 * delta / (1 + elapsed);
                this._scroll.velocity = 0.8 * v + 0.2 * this._scroll.velocity;
            }, this);

            this._scroll = {
                velocity: 0,
                frame: cur_touch.clientY,
                timestamp: Date.now(),
                ticker: setInterval(track_move, 100),
                cur_touch: cur_touch,
                prev_touch: undefined
            };
        }
    },

    _scrollmove: function (event) {
        if (this._is_scrolling) {
            var prev_touch = this._scroll.prev_touch = this._scroll.cur_touch;
            var cur_touch = this._scroll.cur_touch = this.copyTouch(event.originalEvent.touches[0]);

            var css_top = this.$scrollable.position().top + cur_touch.clientY - prev_touch.clientY;
            if (css_top < 0) {
                this.$scrollable.css({ top: css_top });
                setTimeout(_.bind(function() { this.track_anchor(); }, this));
            } else {
                var REFRESH_POS_FN = function (x) {
                    return (-50/Math.pow(500, 2)) * Math.pow(x - 500, 2) + 50; };
                var scrollY = (this.$scrollable.data('scrollY') || 0) + cur_touch.clientY - prev_touch.clientY;
                this.$scrollable.data({'scrollY': scrollY});
                this.$scrollable.css({ top: REFRESH_POS_FN(scrollY) });
            }
        }
    },

    _scrollend: function (event) {
        if (this._is_scrolling && event.originalEvent.touches.length === 0) {
            this._scroll.cur_touch = this._scroll._prev_touch = undefined;
            this.$scrollable.data({'scrollY': ''});

            clearTimeout(this._scroll && this._scroll.ticker);
            if (this._scroll.velocity > 10 || this._scroll.velocity < -10) {
                var amplitude = 0.8 * this._scroll.velocity;

                if (amplitude) {
                    var TIMECONSTANT = 325; // "Mimic iOS (in its UIWebView, decelerationRate normal)"
                    var delta = amplitude * Math.exp(-100 / TIMECONSTANT);
                    var mult = delta > 1 ? 1 : -1;
                    // TODO - custom animation w/cancel
                    //this.$scrollable.animate({ top: this.$scrollable.position().top + delta }, { easing: 'easeOutQuad', duration: 1000 });
                    this._animate_to_position(this.$scrollable.position().top + delta);
                }
            }

            if (this.$scrollable.position().top > 0) {
                this.$scrollable.animate({top: 0}, {easing: 'easeOutQuad', duration: 150});
            }
        }
        this._is_scrolling = undefined;
    },

    _animate_to_position: function (position) {
        var ANIMATION_RATE = 200; // px/100ms
        var ANIMATION_SLOWDOWN_TARGET = ANIMATION_RATE * 1.5; // begin slowdown

        clearTimeout(this._animate_timeout);
//        this.$el.css({'transition': 'top 500ms'});
        this._is_animating = true;
        this._animation_target = position;
        var delta = this.$scrollable.position().top - position;
        var direction = (delta >= 0 ? 1 : -1);
        delta = Math.abs(delta);

        if (delta > ANIMATION_SLOWDOWN_TARGET) {
            this.$scrollable.css({top: this.$scrollable.position().top - direction * ANIMATION_RATE});
            this._animate_timeout = setTimeout(_.bind(function () {
                console.log('animte to :' + position);
                this._animate_to_position(position);
            }, this), 100);
        } else {
            this.$scrollable.animate({top: position}, {easing: 'easeOutQuad', duration: 200});
        }


    },

    copyTouch: function (touch) {
        return {
            clientY: touch.clientY,
            clientX: touch.clientX
        };
    }

});

