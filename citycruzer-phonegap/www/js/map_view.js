"use strict";

var MapView = Backbone.View.extend({
    events: {
        'tap .list_view_toggle': '_handleListviewShow',
    },

    initialize: function () {
        var camera_conf = MAP_CONF.center;
        this.markers = MAP_CONF.markers;

        var map_options = {
            'camera': {
              'latLng': new plugin.google.maps.LatLng(camera_conf.lat, camera_conf.lng),
              'zoom': camera_conf.zoom
            }
        };
        this.$list_view = this.$('.list_view_container');

        // Initialize the map view
        this.map = plugin.google.maps.Map.getMap(this.el, map_options);

        // Custom Maps events (on ready, on click)
        // https://github.com/wf9a5m75/phonegap-googlemaps-plugin/wiki/Map#listen-events
        var mapEvents = plugin.google.maps.event;
        this.map.on(mapEvents.MAP_READY, _.bind(this._onMapReady, this));
        this.map.on(mapEvents.MAP_CLICK, _.bind(this._handleMapTap, this));
    },

    render: function () {
        _.each(this.markers, _.bind(function (marker) {
            this.map.addMarker({
                'position': new plugin.google.maps.LatLng(marker.lat, marker.lng),
                'animation': plugin.google.maps.Animation.DROP
            });
        }, this));
    },

    _handleListviewShow: function () {
        this.$list_view.addClass('visible');
    },

    _handleMapTap: function () {
        this.$list_view.removeClass('visible');
    },

    _onMapReady: function () {
        this.render();
    }
});

