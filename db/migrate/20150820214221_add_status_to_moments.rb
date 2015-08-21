class AddStatusToMoments < ActiveRecord::Migration
  def change
      add_column :moments, :status, :string
  end
end
