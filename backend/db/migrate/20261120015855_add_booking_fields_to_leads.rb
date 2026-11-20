class AddBookingFieldsToLeads < ActiveRecord::Migration[8.1]
  def change
    add_column :leads, :name, :string
    add_column :leads, :equipment, :string
    add_column :leads, :note, :text
  end
end
