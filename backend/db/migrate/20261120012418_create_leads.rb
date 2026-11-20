class CreateLeads < ActiveRecord::Migration[8.1]
  def change
    create_table :leads do |t|
      t.string :service, null: false
      t.date :event_date, null: false
      t.string :guests, null: false
      t.string :location, null: false
      t.string :phone, null: false
      t.string :source

      t.timestamps
    end
  end
end
