"use strict";

var MapView = Backbone.View.extend({
    templates: {
        list_elem: '#list_template'
    },

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

        this.bike_shops = new BikeShops(); // JSON.parse(window.localStorage.getItem('markers') || '[]');
        this.bike_shops.on('change', _.bind(this.render, this));
        this.bike_shops.fetch();

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
        if (this.bike_shops.length > 0) {
            var marker_animation = plugin.google.maps.Animation.DROP;

            // render markers on map
            this._rendered_markers = _.map(this.bike_shops.models, _.bind(function (shop) {
                return this.map.addMarker({
                    'position': new plugin.google.maps.LatLng(shop.get('latitude'), shop.get('longitude')),
                    'animation': marker_animation,
                    'title': shop.get('name'),
                }, _.bind(this._handleMarkerClick, this));
            }, this));

            this.$list_view.html(
                    this.render_template('list_elem', {markers: this.bike_shops.models}));
        } else {
            console.log('No Markers Found');
        }
    },

    render_template: function (template_name, options) {
        var template = _.template($(this.templates[template_name]).html() || '');
        return template(options || {});
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

