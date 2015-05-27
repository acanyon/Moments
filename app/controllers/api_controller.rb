class ApiController < ActionController::Base
    def example
        markers_json = {
            'center' => {
                'lat' => 37.7833, 'lng' => -122.4167, # san francisco
                'zoom' => 13
            },

            'markers' => [
                { 'lat' => 37.7966021, 'lng' => -122.4233821,
                  'title' => 'Big Swingin\' Cycles',
                  'snippet' => '2260 Van Ness Ave\nSan Francisco, CA 94109' },

                { 'lat' => 37.7958912, 'lng' => -122.4227504,
                  'title' => 'High Trails Cyclery',
                  'snippet' => '1825 Polk St\nSan Francisco, CA 94109' },
            ]
        }

        render json: markers_json, layout: false, content_type: 'application/json'


    end
end

