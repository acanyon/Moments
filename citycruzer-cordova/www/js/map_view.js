"use strict";

var MapView = Backbone.View.extend({
    events: {
        'tap .list_view_toggle': '_handleListviewShow',
    },

    default_options: {
        'camera_conf': { 'lat': 37.7833, 'lng': -122.4167, 'zoom': 13 }, 
     },

    initialize: function (options) {
        options = _.defaults(options, this.default_options);
        var camera_conf = options.camera_conf;
        var map_options = {
            'camera': {
              'latLng': new plugin.google.maps.LatLng(camera_conf.lat, camera_conf.lng),
              'zoom': camera_conf.zoom
            }
        };

        this.marker_info = []; // JSON.parse(window.localStorage.getItem('markers') || '[]');
        this._fetchMarkers();
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
        if (this.marker_info.length > 0) {
            var marker_animation = plugin.google.maps.Animation.DROP;

            // render markers on map
            this._rendered_markers = _.map(this.marker_info, _.bind(function (info) {
                return this.map.addMarker({
                    'position': new plugin.google.maps.LatLng(info.lat, info.lng),
                    'animation': marker_animation,
                    'title': info.title,
                }, _.bind(this._handleMarkerClick, this));
            }, this));

            // render list view
            var list_html = _.map(this.marker_info, _.bind(function (info) {
                return '<div class="store_item"><b>' + info.title + '</b>' + '<br/>' + info.snippet + '</div>';
            }, this)).join('');
            this.$list_view.html(list_html);
        } else {
            console.log('No Markers Found');
        }
    },

    _fetchMarkers: function () {
        $.ajax('http://citycruzer.herokuapp.com/api/example.json')
            .done(_.bind(function (data, textStatus, jqXHR) {
                this.marker_info = data.markers;
                this.render();
                window.localStorage.addItem('markers', JSON.strigify(data.markers));
            }, this)).fail(function () {
                console.error('Unknown Error occurred when trying to fetch data.');
            });
    },

    _onMapReady: function () {
        this._is_map_ready = true;
        this.render();
    },

    _handleMarkerClick: function (marker) {
        marker.showInfoWindow();
    },

    _handleListviewShow: function () {
        this.$list_view.addClass('visible');
    },

    _handleMapTap: function () {
        this.$list_view.removeClass('visible');
    },

});

