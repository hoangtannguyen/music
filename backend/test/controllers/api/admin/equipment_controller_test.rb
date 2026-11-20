require "test_helper"

module Api
  module Admin
    class EquipmentControllerTest < ActionDispatch::IntegrationTest
      setup do
        ::Admin.create!(email: "admin@example.com", password: "test-password")
        %w[speaker mixer light].each { |key| create_equipment_category(key) }
        @mixer = Equipment.create!(name: "Mixer digital 32 kênh", kind: "mixer", position: 2)
        @speaker = Equipment.create!(name: "Loa sub 18\"", kind: "speaker", spec: "1200W", position: 1)
      end

      def auth_headers
        { "Authorization" => ActionController::HttpAuthentication::Basic.encode_credentials("admin@example.com", "test-password") }
      end

      test "public list is ordered by position" do
        get api_equipment_index_url

        assert_response :ok
        assert_equal [ @speaker.id, @mixer.id ], response.parsed_body.map { |item| item["id"] }
        assert_equal "speaker", response.parsed_body.first["kind"]
      end

      test "requires admin credentials" do
        post api_admin_equipment_index_url, params: { name: "Loa", kind: "speaker" }

        assert_response :unauthorized
      end

      test "creates, updates and deletes equipment" do
        post api_admin_equipment_index_url, headers: auth_headers,
          params: { name: "Đèn follow", kind: "light", spec: "Bám nhân vật", description: "Làm nổi bật cô dâu chú rể", position: 3 }
        assert_response :created
        item = Equipment.find(response.parsed_body["id"])

        patch api_admin_equipment_url(item), headers: auth_headers, params: { spec: "" }
        assert_response :ok
        assert_equal "", item.reload.spec

        delete api_admin_equipment_url(item), headers: auth_headers
        assert_response :no_content
        assert_not Equipment.exists?(item.id)
      end

      test "rejects an unknown kind or blank position" do
        post api_admin_equipment_index_url, headers: auth_headers, params: { name: "Drone", kind: "drone", position: "" }

        assert_response :unprocessable_content
        assert_equal %w[kind position], response.parsed_body["errors"].keys.sort
      end
    end
  end
end
