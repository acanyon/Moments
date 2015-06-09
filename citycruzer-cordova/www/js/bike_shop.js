"use strict" ;

var Shop = Backbone.Model.extend({
    bike_categories: function () {
       return _.uniq(_.map(this.get('bicycles'), function (bike_info) {
           return bike_info.category;
       }) || []);
    }
});

var BikeShops = Backbone.Collection.extend({
    model: Shop,

    fetch: function () {
        $.ajax('http://citycruzer.herokuapp.com/api/example.json')
            .done(_.bind(function (data, textStatus, jqXHR) {
                _.each(data.markers, function (shop_info) {
                    this.add(shop_info, {silent: true});
                }, this);
                this.trigger('sync');
//                window.localStorage.addItem('markers', JSON.strigify(data.markers));
            }, this)).fail(function () {
                console.error('Unknown Error occurred when trying to fetch data.');
            });
    }
});
