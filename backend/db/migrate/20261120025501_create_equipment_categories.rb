class CreateEquipmentCategories < ActiveRecord::Migration[8.1]
  def change
    create_table :equipment_categories do |t|
      t.string :key, null: false
      t.string :name, null: false
      t.string :icon, null: false, default: "accessory"
      t.integer :position, null: false, default: 0

      t.timestamps
    end
    add_index :equipment_categories, :key, unique: true
  end
end
