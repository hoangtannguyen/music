class Lead < ApplicationRecord
  GUEST_RANGES = [ "Dưới 100 khách", "100 - 300 khách", "300 - 500 khách", "Trên 500 khách" ].freeze
  PHONE_FORMAT = /\A[0-9+().\-\s]{9,16}\z/
  # Admin workflow; keep in sync with frontend/src/pages/AdminPage.tsx
  STATUSES = %w[new contacted quoted done cancelled].freeze

  validates :status, inclusion: { in: STATUSES }

  validates :service, presence: true
  validate :service_known
  validates :guests, inclusion: { in: GUEST_RANGES }
  validates :event_date, presence: true
  validates :location, presence: true, length: { maximum: 255 }
  validates :phone, format: { with: PHONE_FORMAT }
  validates :source, length: { maximum: 50 }
  validates :name, length: { maximum: 100 }
  validates :note, length: { maximum: 1000 }
  validate :event_date_not_in_past
  validate :equipment_types_known

  private

  # service is an EventType key (managed in admin)
  def service_known
    errors.add(:service, "is not a known event type") if service.present? && !EventType.exists?(key: service)
  end

  # equipment is stored as a comma-separated list of EquipmentCategory keys
  def equipment_types_known
    unknown = equipment.to_s.split(",") - EquipmentCategory.where(key: equipment.to_s.split(",")).pluck(:key)
    errors.add(:equipment, "contains unknown types: #{unknown.join(', ')}") if unknown.any?
  end

  def event_date_not_in_past
    errors.add(:event_date, "must not be in the past") if event_date.present? && event_date < Date.current
  end
end
