class BikeShop < ActiveRecord::Base
    has_many :bicycles

    def marker_format
        { 'lat' => latitude,
          'lng' => longitude,
          'title' => name,
          'snippet' => address }
    end
end
