class Equipment < ApplicationRecord
  validates :name, presence: true, length: { maximum: 120 }
  # kind is an EquipmentCategory key
  validates :kind, presence: true
  validate :kind_known
  validates :spec, length: { maximum: 80 }
  validates :description, length: { maximum: 255 }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:position, :id) }

  private

  def kind_known
    errors.add(:kind, "is not a known equipment category") if kind.present? && !EquipmentCategory.exists?(key: kind)
  end
end
