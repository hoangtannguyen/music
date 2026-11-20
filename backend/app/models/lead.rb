class Lead < ApplicationRecord
  # Keep in sync with the options of the quick-quote form (frontend/src/components/QuoteForm.tsx)
  SERVICES = %w[wedding birthday gala opening conference music].freeze
  GUEST_RANGES = [ "Dưới 100 khách", "100 - 300 khách", "300 - 500 khách", "Trên 500 khách" ].freeze
  PHONE_FORMAT = /\A[0-9+().\-\s]{9,16}\z/

  validates :service, inclusion: { in: SERVICES }
  validates :guests, inclusion: { in: GUEST_RANGES }
  validates :event_date, presence: true
  validates :location, presence: true, length: { maximum: 255 }
  validates :phone, format: { with: PHONE_FORMAT }
  validates :source, length: { maximum: 50 }
  validate :event_date_not_in_past

  private

  def event_date_not_in_past
    errors.add(:event_date, "must not be in the past") if event_date.present? && event_date < Date.current
  end
end
