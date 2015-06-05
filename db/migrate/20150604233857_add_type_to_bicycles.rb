class AddTypeToBicycles < ActiveRecord::Migration
  def change
      add_column :bicycles, :category, :string, default: 'other', null: false
  end
end
