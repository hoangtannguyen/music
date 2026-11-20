require "test_helper"

class LeadMailerTest < ActionMailer::TestCase
  setup do
    @previous_env = ENV.to_h.slice("LEAD_NOTIFY_EMAIL", "SMTP_USERNAME")
    ENV["LEAD_NOTIFY_EMAIL"] = "owner@example.com"
    ENV["SMTP_USERNAME"] = "sender@example.com"
    create_event_type(key: "wedding", name: "Tiệc cưới")
    create_equipment_category("speaker", "Loa")
    create_equipment_category("light", "Đèn sân khấu")
  end

  teardown do
    %w[LEAD_NOTIFY_EMAIL SMTP_USERNAME].each { |key| ENV[key] = @previous_env[key] }
  end

  test "new_lead sends the request details to the owner" do
    lead = Lead.create!(
      service: "wedding", event_date: Date.new(2030, 5, 20), guests: "100 - 300 khách", location: "Nhà hàng ABC, TP. Huế",
      phone: "0987 654 321", name: "Nguyễn Văn A", equipment: "speaker,light", note: "Lắp trước 17h", source: "booking-page"
    )

    mail = LeadMailer.new_lead(lead)

    assert_equal [ "owner@example.com" ], mail.to
    assert_equal [ "sender@example.com" ], mail.from
    assert_equal "[Event Pro] Yêu cầu báo giá mới ##{lead.id}: Tiệc cưới ngày 20/05/2030", mail.subject
    text = mail.text_part.decoded
    [ "Nguyễn Văn A", "0987 654 321", "20/05/2030", "Nhà hàng ABC, TP. Huế", "Loa, Đèn sân khấu", "Lắp trước 17h", "Trang Báo giá" ].each do |expected|
      assert_includes text, expected
    end
    assert_includes mail.html_part.decoded, "tel:0987654321"
  end
end
