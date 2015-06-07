"use strict" ;

var Shop = Backbone.Model.extend({
});

var BikeShops = Backbone.Collection.extend({
    model: Shop,

    fetch: function () {
        $.ajax('http://citycruzer.herokuapp.com/api/example.json')
            .done(_.bind(function (data, textStatus, jqXHR) {
                _.each(data.markers, function (shop_info) {
                    this.add(shop_info);
                }, this);
                this.trigger('change');
//                window.localStorage.addItem('markers', JSON.strigify(data.markers));
            }, this)).fail(function () {
                console.error('Unknown Error occurred when trying to fetch data.');
            });
    }
});
