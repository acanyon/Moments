class CreateMoments < ActiveRecord::Migration
  def change
    create_table :moments do |t|
      t.references :user,         null: false, default: "", index: true
      t.integer    :privacy_type, default: 0
      t.integer    :view_count,   default: 0
      t.text       :description,  null: false, default: ""
      t.text       :photos,       null: false, default: ""

      t.timestamps
    end

    create_table :users_moments do |t|
      t.references :user,   index: true
      t.references :moment, index: true
    end
  end
end
