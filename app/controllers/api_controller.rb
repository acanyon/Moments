class ApiController < ActionController::Base
    def example
        markers_json = {
            'center' => {
                'lat' => 37.7833, 'lng' => -122.4167, # san francisco
                'zoom' => 13
            },

            'markers' => BikeShop.all.map(&:marker_format)
        }

        render json: markers_json, layout: false, content_type: 'application/json'
    end
end

