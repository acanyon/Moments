"use strict" ;

var map;

define(function (require) {
    var app = {
        // Application Constructor
        initialize: function () {
            this.bindEvents();
        },
        // Bind Event Listeners
        //
        // Bind any events that are required on startup. Common events are:
        // 'load', 'deviceready', 'offline', and 'online'.
        bindEvents: function () {
            document.addEventListener('deviceready', this.onDeviceReady, false);
        },
        // deviceready Event Handler
        //
        // The scope of 'this' is the event. In order to call the 'receivedEvent'
        // function, we must explicitly call 'app.receivedEvent(...);'
        onDeviceReady: function () {
            var camera_conf = MAP_CONF.center;
            var map_canvas = document.getElementById("map_canvas");
            var map_options = {
                    'camera': {
                      'latLng': new plugin.google.maps.LatLng(camera_conf.lat, camera_conf.lng),
                      'zoom': camera_conf.zoom
                    }
                };

            // Initialize the map view
            map = plugin.google.maps.Map.getMap(map_canvas, map_options);

            // Wait until the map is ready status.
            map.addEventListener(plugin.google.maps.event.MAP_READY, app.onMapReady);
        },

        onMapReady: function () {
            var button = document.getElementById("button");
            button.addEventListener("click", app.onBtnClicked, false);

            // add markers
            var i;
            var marker;
            _.each(MAP_CONF.markers, function (marker) {
                map.addMarker({
                    'position': new plugin.google.maps.LatLng(marker.lat, marker.lng),
                    'animation': plugin.google.maps.Animation.DROP
                });
            });
        },

        onBtnClicked: function () {
            map.showDialog();
        }
    };

    return app;
});
