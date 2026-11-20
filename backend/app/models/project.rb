class Project < ApplicationRecord
  include HasImage

  belongs_to :event_type

  validates :title, presence: true, length: { maximum: 120 }
  validates :location, length: { maximum: 120 }
  validates :date_label, length: { maximum: 20 }

  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:position, :id) }
end
