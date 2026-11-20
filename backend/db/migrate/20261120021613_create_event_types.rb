class CreateEventTypes < ActiveRecord::Migration[8.1]
  def change
    create_table :event_types do |t|
      t.string :key, null: false
      t.string :name, null: false
      t.string :summary
      t.text :description
      t.string :guests
      t.text :items
      t.integer :position, null: false, default: 0

      t.timestamps
    end
    add_index :event_types, :key, unique: true
  end
end
