"use strict";

var MapView = Backbone.View.extend({
    templates: {
        bikeshop_tooltip: '#tooltip_template',
        list_elem: '#list_template',
        bike_shop: '#bike_store_landing',
        bike_checkout: '#checkout_template',
    },

    events: {
        // todo - should use "tap" event, but may fire multiple "tap" events with one "click"
        //   .. need custom event?
        'click .list_view_toggle': '_handleListviewShow',
        'click .store_link': '_handleListviewClick',
        'click .button.back': '_handleLandingBack',    // TODO - generalize back button
        'click .button.reserve_bike': '_handleReserveBike',
        'click .button.confirm_reservation': '_handleReservationConfirmation'
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
        this.bike_shops.on('sync', _.bind(this.render, this));
        this.bike_shops.fetch();

        this.$map_canvas = this.$('#map_canvas');
        this.$list_view = this.$('.list_view_container');
        this.$bike_landing_screen = this.$('.screen.bike_store_landing');
        this.$checkout_screen = this.$('.screen.bike_checkout');
        this.$map_tooltip = this.$('#map_canvas_tooltip');

        // Initialize the map view
        this.map = plugin.google.maps.Map.getMap(this.$map_canvas[0], map_options);
        this.map.clear();

        // Custom Maps events (on ready, on click)
        // https://github.com/wf9a5m75/phonegap-googlemaps-plugin/wiki/Map#listen-events
        var mapEvents = plugin.google.maps.event;
        this.map.on(mapEvents.MAP_CLICK, _.bind(this._handleMapTap, this));
        this.map.on(mapEvents.CAMERA_CHANGE, _.bind(this._handleCameraChange, this));
    },

    render: function () {
        if (this.bike_shops.length > 0) {
            var marker_animation = plugin.google.maps.Animation.DROP;

            // render markers on map
            _.each(this.bike_shops.models, _.bind(function (shop) {
                if (shop.get('marker')) { return ; } // marker already exists on map
                this.map.addMarker({
                    'position': new plugin.google.maps.LatLng(shop.get('latitude'), shop.get('longitude')),
                    'animation': marker_animation,
                }, _.bind(function (marker) {
                    shop.set('marker', marker);
                    marker.addEventListener(plugin.google.maps.event.MARKER_CLICK,
                                            _.bind(this.show_tooltip, this));
                }, this));
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

    show_bikeshop_landing: function (bike_shop) {
        this.$bike_landing_screen.html(
                this.render_template('bike_shop', { bike_shop: bike_shop }) );
        this.$bike_landing_screen.addClass('visible');
        this.map.setClickable(false);
    },

    begin_bike_checkout: function (bike_shop) {
        this.$checkout_screen.html(this.render_template('bike_checkout', {
            bike_shop: bike_shop,
            bike: bike_shop.get('bicycles')[0], // TODO - choose bike by user
        }));
        this.$checkout_screen.addClass('visible');
    },

    hide_bikeshop_landing: function () {
        this.$bike_landing_screen.removeClass('visible');
        this.map.setClickable(true);
    },

    show_tooltip: function (marker) {
        var bike_shop = this.bike_shops.where({marker: marker})[0];
        this.$map_tooltip.html(this.render_template('bikeshop_tooltip', { bike_shop: bike_shop }));
        var latlng = new plugin.google.maps.LatLng(bike_shop.get('latitude'), bike_shop.get('longitude'));
        this.position_tooltip(latlng);
        this.$map_tooltip.addClass('visible');
    },

    position_tooltip: function (latlng) {
        latlng = latlng || this.$map_tooltip.data('latlng');
        if (latlng) {
            this.$map_tooltip.data('latlng', latlng);
            this.map.fromLatLngToPoint(latlng, _.bind(function (pos) {
                debugger;
                this.$map_tooltip.css({
                    left: pos[0],
                    bottom: this.$map_canvas.height() - pos[1],
                });
            }, this));
        }
    },

    hide_tooltip: function () {
        this.$map_tooltip.removeClass('visible');
        this.$map_tooltip.data('latlng', undefined);
    },

    _handleMarkerClick: function (marker) {
        this.show_tooltip(marker);
    },

    _handleListviewClick: function (event) {
        var bike_shop = this.bike_shops.get($(event.currentTarget).data('cid'));
        this.show_bikeshop_landing(bike_shop);
    },

    _handleLandingBack: function (event) {
        this.hide_bikeshop_landing();
    },

    _handleListviewShow: function () {
        this.$list_view.addClass('visible');
    },

    _handleReserveBike: function (event) {
        var bike_shop = this.bike_shops.get($(event.currentTarget).data('cid'));
        this.begin_bike_checkout(bike_shop);
    },

    _handleReservationConfirmation: function (event) {
        this.hide_bikeshop_landing();
        this.$checkout_screen.removeClass('visible');
    },

    _handleMapTap: function () {
        this.$list_view.removeClass('visible');
        this.hide_tooltip();
    },

    _handleCameraChange: function (event) {
        this.position_tooltip();
    },

});

