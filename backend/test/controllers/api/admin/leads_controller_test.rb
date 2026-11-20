require "test_helper"

module Api
  module Admin
    class LeadsControllerTest < ActionDispatch::IntegrationTest
      setup do
        ::Admin.create!(email: "admin@example.com", password: "test-password")
        create_event_type
        create_equipment_category("speaker", "Loa")
        create_equipment_category("light", "Đèn sân khấu")

        attributes = { service: "wedding", event_date: Date.current.next_day, guests: "100 - 300 khách", location: "TP. Huế", phone: "0900000000" }
        @old_lead = Lead.create!(attributes.merge(created_at: 2.days.ago))
        @new_lead = Lead.create!(attributes.merge(equipment: "speaker,light", status: "contacted"))
      end

      def auth_headers(password = "test-password", email: "admin@example.com")
        { "Authorization" => ActionController::HttpAuthentication::Basic.encode_credentials(email, password) }
      end

      test "lists leads newest first with status counts" do
        get api_admin_leads_url, headers: auth_headers

        assert_response :ok
        body = response.parsed_body
        assert_equal [ @new_lead.id, @old_lead.id ], body["leads"].map { |lead| lead["id"] }
        assert_equal %w[speaker light], body["leads"].first["equipment"]
        assert_equal({ "new" => 1, "contacted" => 1 }, body["counts"])
      end

      test "filters leads by status" do
        get api_admin_leads_url(status: "new"), headers: auth_headers

        assert_equal [ @old_lead.id ], response.parsed_body["leads"].map { |lead| lead["id"] }
        assert_equal 1, response.parsed_body["total"]
      end

      test "updates the status" do
        patch api_admin_lead_url(@old_lead), params: { status: "quoted" }, headers: auth_headers

        assert_response :ok
        assert_equal "quoted", @old_lead.reload.status
      end

      test "rejects an unknown status" do
        patch api_admin_lead_url(@old_lead), params: { status: "archived" }, headers: auth_headers

        assert_response :unprocessable_content
        assert_equal "new", @old_lead.reload.status
      end

      test "rejects a wrong password" do
        get api_admin_leads_url, headers: auth_headers("wrong")

        assert_response :unauthorized
        assert_nil response.headers["WWW-Authenticate"]
      end

      test "rejects requests without credentials" do
        get api_admin_leads_url

        assert_response :unauthorized
      end

      test "accepts the email case-insensitively" do
        get api_admin_leads_url, headers: auth_headers(email: " Admin@Example.com")

        assert_response :ok
      end

      test "rejects an unknown email" do
        get api_admin_leads_url, headers: auth_headers(email: "nobody@example.com")

        assert_response :unauthorized
      end
    end
  end
end
