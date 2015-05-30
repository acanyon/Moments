class CreateBicycles < ActiveRecord::Migration
  def change
    create_table :bicycles do |t|
      t.string :name
      t.integer :bike_shop_id
      t.float :hourly_rate
      t.float :daily_rate
      t.string :description
      t.string :image

      t.timestamps
    end
  end
end
