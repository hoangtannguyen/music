# Equipment group (Loa, Micro, ...) managed in admin. Equipment and leads store the group's key.
class EquipmentCategory < ApplicationRecord
  # Icons drawn by the frontend (frontend/src/components/EquipmentIcon.tsx)
  ICONS = %w[speaker mic mixer light led accessory].freeze

  # key is stored on equipment and leads; it cannot change once created
  attr_readonly :key

  validates :key, presence: true, uniqueness: true, format: { with: /\A[a-z0-9-]+\z/ }, length: { maximum: 40 }
  validates :name, presence: true, length: { maximum: 80 }
  validates :icon, inclusion: { in: ICONS }
  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  before_destroy :ensure_unused

  scope :ordered, -> { order(:position, :id) }

  private

  def ensure_unused
    return unless Equipment.exists?(kind: key)

    errors.add(:base, "still has equipment")
    throw :abort
  end
end
