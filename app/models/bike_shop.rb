class BikeShop < ActiveRecord::Base
    has_many :bicycles

    def marker_format
        as_json(include: :bicycles)
    end
end
