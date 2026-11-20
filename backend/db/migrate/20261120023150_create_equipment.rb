class CreateEquipment < ActiveRecord::Migration[8.1]
  def change
    create_table :equipment do |t|
      t.string :name, null: false
      t.string :kind, null: false
      t.string :spec
      t.string :description
      t.integer :position, null: false, default: 0

      t.timestamps
    end
  end
end
