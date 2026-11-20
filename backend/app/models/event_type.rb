class EventType < ApplicationRecord
  include HasImage

  has_many :projects, dependent: :restrict_with_error

  # key is the slug used in URLs (/services#wedding) and stored on leads; it cannot change once created
  attr_readonly :key

  validates :key, presence: true, uniqueness: true, format: { with: /\A[a-z0-9-]+\z/ }, length: { maximum: 40 }
  validates :name, presence: true, length: { maximum: 80 }
  validates :summary, length: { maximum: 160 }
  validates :description, length: { maximum: 1000 }
  validates :guests, length: { maximum: 80 }

  validates :position, numericality: { only_integer: true, greater_than_or_equal_to: 0 }

  scope :ordered, -> { order(:position, :id) }

  # Suggested equipment, one item per line
  def item_list
    items.to_s.lines.map(&:strip).reject(&:empty?)
  end
end
