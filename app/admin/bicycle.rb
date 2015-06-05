ActiveAdmin.register Bicycle do
    permit_params :name, :bike_shop_id, :hourly_rate, :daily_rate, :description, :image, :category

    form do |f|
      f.inputs do
        f.input :bike_shop
        f.input :name
        f.input :category, as: :select, collection: %w(standard mountain racing other)
        f.input :hourly_rate
        f.input :daily_rate
        f.input :image
        f.input :description
      end
    end

# See permitted parameters documentation:
# https://github.com/activeadmin/activeadmin/blob/master/docs/2-resource-customization.md#setting-up-strong-parameters
#
# permit_params :list, :of, :attributes, :on, :model
#
# or
#
# permit_params do
#   permitted = [:permitted, :attributes]
#   permitted << :other if resource.something?
#   permitted
# end


end
