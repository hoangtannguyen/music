# JSON shape of event types and projects, shared by the public and admin APIs
module ContentSerialization
  extend ActiveSupport::Concern

  private

  def event_type_json(event_type)
    event_type.as_json(only: %i[id key name summary description guests position])
      .merge("items" => event_type.item_list, "image_url" => image_url(event_type))
  end

  def equipment_json(equipment)
    equipment.as_json(only: %i[id name kind spec description position])
  end

  def project_json(project)
    project.as_json(only: %i[id title location date_label position])
      .merge("category" => project.event_type.key, "event_type_id" => project.event_type_id, "image_url" => image_url(project))
  end

  def image_url(record)
    rails_blob_url(record.image) if record.image.attached?
  end
end
