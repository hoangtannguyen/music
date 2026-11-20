# Notifies the shop owner (LEAD_NOTIFY_EMAIL) about a new quote/booking request
class LeadMailer < ApplicationMailer
  def self.enabled?
    ENV["LEAD_NOTIFY_EMAIL"].present?
  end

  def new_lead(lead)
    @lead = lead
    @event_type_name = EventType.find_by(key: lead.service)&.name || lead.service
    kinds = lead.equipment.to_s.split(",")
    names = EquipmentCategory.where(key: kinds).pluck(:key, :name).to_h
    @equipment = kinds.map { |kind| names.fetch(kind, kind) }
    @source = lead.source == "booking-page" ? "Trang Báo giá" : "Form nhanh trang chủ"
    @admin_url = ENV.fetch("FRONTEND_URL", "http://localhost:5173").chomp("/") + "/admin"

    mail to: ENV.fetch("LEAD_NOTIFY_EMAIL"),
      subject: "[Event Pro] Yêu cầu báo giá mới ##{lead.id}: #{@event_type_name} ngày #{lead.event_date.strftime('%d/%m/%Y')}"
  end
end
