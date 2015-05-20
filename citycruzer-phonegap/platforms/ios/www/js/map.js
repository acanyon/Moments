var MapView = Backbone.View.extend({
    map: undefined,

    initialize: function () {
        var camera_conf = MAP_CONF.center;
        var map_options = {
            'camera': {
              'latLng': new plugin.google.maps.LatLng(camera_conf.lat, camera_conf.lng),
              'zoom': camera_conf.zoom
            }
        };

        // Initialize the map view
        this.map = plugin.google.maps.Map.getMap(this.el, map_options);

        // Wait until the map is ready status.
        this.map.addEventListener(plugin.google.maps.event.MAP_READY, _.bind(this._onMapReady, this));
    },

    _onMapReady: function () {
        console.log('map ready!!');
        _.each(MAP_CONF.markers, _.bind(function (marker) {
            console.log('adding marker');
            console.log(marker);
            console.log(this);
            this.map.addMarker({
                'position': new plugin.google.maps.LatLng(marker.lat, marker.lng),
                'animation': plugin.google.maps.Animation.DROP
            });
        }, this));
    }
});

