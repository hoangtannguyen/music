class CreateProjects < ActiveRecord::Migration[8.1]
  def change
    create_table :projects do |t|
      t.string :title, null: false
      t.references :event_type, null: false, foreign_key: true
      t.string :location
      t.string :date_label
      t.integer :position, null: false, default: 0

      t.timestamps
    end
  end
end
