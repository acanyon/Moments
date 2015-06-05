class Bicycle < ActiveRecord::Base
    belongs_to :bike_shop

    validates :category, inclusion: { in: %w(standard mountain racing other)}
end
