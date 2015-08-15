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
    },

    set_anchor: function ($el) {
        this.$anchor = $el;this.$anchor = $el;
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

            css_top = (-50/Math.pow(300, 2)) * Math.pow(scrollY - 300, 2) + 50;
            this.$scrollable.css({ top: css_top });
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

