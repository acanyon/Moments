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

    refresh: function () {
        clearTimeout(this._refresh_timeout);

        var NUM_RETRIES = 4;
        var _retry_count = NUM_RETRIES;
        var callback = _.bind(function (is_modified) {
            if (is_modified) {
                _retry_count = NUM_RETRIES;
            }

            if (_retry_count > -1) {
                _retry_count -= 1;
                console.log('* refresh w/ retries: ' + _retry_count);
                this._refresh(callback);
            }
        }, this);
        this._refresh(callback);
    },

    _refresh: function (callback) {
        var ANIMATION_DURATION = 50; //ms
        var REFRESH_INTERVAL = 100; // ms
        if (this.$anchor) {
            var delayed_callback = _.bind(function (is_modified) {
                this._refresh_timeout = setTimeout(
                    function () { callback(is_modified); },
                    REFRESH_INTERVAL);
            }, this);

            if (this._anchor_offset.top !== this.$anchor.offset().top) {
                var deltaY = this._anchor_offset.top - this.$anchor.offset().top;
                var css_top = this.$scrollable.position().top + deltaY;
                this.$scrollable.animate(
                        { top: css_top }, 
                        ANIMATION_INTERVAL,
                        'swing',
                        _.partial(delayed_callback, true));
            } else {
                delayed_callback(false);
            }
        }
    },

    track_anchor: function ($el) {
        this.$anchor = $el;
        this._anchor_offset = _.extend({}, $el.offset());

        var position = _.extend({}, $el.position());
        var $cur = $el.offsetParent();
        while (! $cur.is(this.$scrollable)) {
            position.top = position.top + $cur.position().top;
            position.left = position.left + $cur.position().left;
            $cur = $cur.offsetParent();
        }
        this._anchor_position = position;
    },

    _scrollstart: function (event) {
        if (event.originalEvent.touches.length === 1) {
            this._touches = [ this.copyTouch(event.originalEvent.touches[0]) ];
        }
    },

    _scrollmove: function (event) {
        var cur_touch = this.copyTouch(event.originalEvent.touches[0]);
        var prev_touch = this._touches[0];
        this._touches.unshift(cur_touch);
        
        var css_top = this.$scrollable.position().top + cur_touch.clientY - prev_touch.clientY;
        if (css_top < 0) {
            this.$scrollable.css({ top: css_top });
        } else {
            var scrollY = (this.$scrollable.data('scrollY') || 0) + cur_touch.clientY - prev_touch.clientY;
            this.$scrollable.data({'scrollY': scrollY});
            this.$scrollable.css({ top: this.REFRESH_POS_FN(scrollY) });
        }
    },

    _scrollend: function (event) {
        if (event.originalEvent.touches.length === 0) {
            this._touches = undefined;
            this.$scrollable.data({'scrollY': ''});
            if (this.$scrollable.position().top > 0) {
                this.$scrollable.animate({top: 0}, {easing: 'easeOutQuad', duration: 150});
            }
        }
    },

    copyTouch: function (touch) {
        return {
            clientY: touch.clientY,
            clientX: touch.clientX
        };
    }
 

});
//_.extend(ScrollView, Backbone.Events);

