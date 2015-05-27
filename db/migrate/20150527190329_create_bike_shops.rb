class CreateBikeShops < ActiveRecord::Migration
  def change
    create_table :bike_shops do |t|
      t.string :name
      t.string :description
      t.string :address
      t.string :latitude
      t.string :longitude

      t.timestamps
    end
  end
end
