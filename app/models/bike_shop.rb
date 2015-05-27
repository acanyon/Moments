class BikeShop < ActiveRecord::Base

    def marker_format
        { 'lat' => latitude,
          'lng' => longitude,
          'title' => name,
          'snippet' => address }
    end
end
