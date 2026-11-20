class Equipment < ApplicationRecord
  # Fixed groups, each with its own icon on the frontend; keep in sync with equipmentTypes (frontend/src/data/siteData.ts)
  KINDS = %w[speaker mic mixer light led accessory].freeze

  validates :name, presence: true, length: { maximum: 120 }
  validates :kind, inclusion: { in: KINDS }
  validates :spec, length: { maximum: 80 }
  validates :description, length: { maximum: 255 }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:position, :id) }
end
