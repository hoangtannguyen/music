require "test_helper"

module Api
  module Admin
    class EquipmentCategoriesControllerTest < ActionDispatch::IntegrationTest
      setup do
        ::Admin.create!(email: "admin@example.com", password: "test-password")
        @mic = create_equipment_category("mic", "Micro", icon: "mic", position: 2)
        @speaker = create_equipment_category("speaker", "Loa", icon: "speaker", position: 1)
      end

      def auth_headers
        { "Authorization" => ActionController::HttpAuthentication::Basic.encode_credentials("admin@example.com", "test-password") }
      end

      test "public list is ordered by position" do
        get api_equipment_categories_url

        assert_response :ok
        assert_equal [ [ "speaker", "Loa", "speaker" ], [ "mic", "Micro", "mic" ] ],
          response.parsed_body.map { |category| category.values_at("key", "name", "icon") }
      end

      test "requires admin credentials" do
        post api_admin_equipment_categories_url, params: { key: "truss", name: "Khung truss", icon: "accessory" }

        assert_response :unauthorized
      end

      test "creates a category that equipment and leads can then use" do
        post api_admin_equipment_categories_url, headers: auth_headers, params: { key: "truss", name: "Khung truss", icon: "accessory", position: 3 }
        assert_response :created

        assert Equipment.new(name: "Truss 6m", kind: "truss").valid?
      end

      test "rejects an unknown icon or an invalid key" do
        post api_admin_equipment_categories_url, headers: auth_headers, params: { key: "Khung Truss", name: "Khung truss", icon: "rocket" }

        assert_response :unprocessable_content
        assert_equal %w[icon key], response.parsed_body["errors"].keys.sort
      end

      test "updates name and icon but never the key" do
        patch api_admin_equipment_category_url(@mic), headers: auth_headers, params: { name: "Micro không dây", icon: "accessory", key: "changed" }

        assert_response :ok
        @mic.reload
        assert_equal [ "mic", "Micro không dây", "accessory" ], [ @mic.key, @mic.name, @mic.icon ]
      end

      test "does not delete a category that still has equipment" do
        Equipment.create!(name: "Loa sub 18\"", kind: "speaker")

        delete api_admin_equipment_category_url(@speaker), headers: auth_headers

        assert_response :unprocessable_content
        assert EquipmentCategory.exists?(@speaker.id)
      end

      test "deletes an unused category" do
        delete api_admin_equipment_category_url(@mic), headers: auth_headers

        assert_response :no_content
        assert_not EquipmentCategory.exists?(@mic.id)
      end
    end
  end
end
