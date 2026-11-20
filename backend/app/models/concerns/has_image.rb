# Required uploaded image (JPEG/PNG/WebP, max 5 MB) stored with Active Storage
module HasImage
  extend ActiveSupport::Concern

  IMAGE_TYPES = %w[image/jpeg image/png image/webp].freeze
  MAX_IMAGE_SIZE = 5.megabytes

  included do
    has_one_attached :image
    validate :image_valid
  end

  private

  def image_valid
    unless image.attached?
      errors.add(:image, "can't be blank")
      return
    end
    errors.add(:image, "must be a JPEG, PNG or WebP file") unless IMAGE_TYPES.include?(image.blob.content_type)
    errors.add(:image, "must be smaller than 5 MB") if image.blob.byte_size > MAX_IMAGE_SIZE
  end
end
