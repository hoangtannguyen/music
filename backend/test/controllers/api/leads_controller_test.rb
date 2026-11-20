require "test_helper"

module Api
  class LeadsControllerTest < ActionDispatch::IntegrationTest
    def valid_params
      {
        source: "home-quick-quote",
        service: "wedding",
        date: Date.current.next_day.iso8601,
        guests: "100 - 300 khách",
        location: "TP. Huế",
        phone: "0987 654 321"
      }
    end

    test "creates a lead from form-encoded params" do
      assert_difference -> { Lead.count }, 1 do
        post api_leads_url, params: valid_params
      end

      assert_response :created
      lead = Lead.last
      assert_equal "wedding", lead.service
      assert_equal Date.current.next_day, lead.event_date
      assert_equal Lead.last.id, response.parsed_body["id"]
    end

    test "rejects an unknown service" do
      assert_no_difference -> { Lead.count } do
        post api_leads_url, params: valid_params.merge(service: "funeral")
      end

      assert_response :unprocessable_content
      assert response.parsed_body["errors"].key?("service")
    end

    test "rejects an event date in the past" do
      post api_leads_url, params: valid_params.merge(date: Date.current.prev_day.iso8601)

      assert_response :unprocessable_content
      assert response.parsed_body["errors"].key?("event_date")
    end

    test "rejects an invalid phone number" do
      post api_leads_url, params: valid_params.merge(phone: "abc")

      assert_response :unprocessable_content
      assert response.parsed_body["errors"].key?("phone")
    end

    test "rejects missing fields" do
      post api_leads_url, params: { source: "home-quick-quote" }

      assert_response :unprocessable_content
      assert_equal %w[event_date guests location phone service], response.parsed_body["errors"].keys.sort
    end
  end
end
