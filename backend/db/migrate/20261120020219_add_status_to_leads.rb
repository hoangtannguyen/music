class AddStatusToLeads < ActiveRecord::Migration[8.1]
  def change
    add_column :leads, :status, :string, null: false, default: "new"
    add_index :leads, [ :status, :created_at ]
  end
end
