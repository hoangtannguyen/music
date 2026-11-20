require "test_helper"

module Api
  module Admin
    class ContentControllersTest < ActionDispatch::IntegrationTest
      setup do
        ::Admin.create!(email: "admin@example.com", password: "test-password")
        @wedding = create_event_type(key: "wedding", name: "Tiệc cưới")
      end

      def auth_headers
        { "Authorization" => ActionController::HttpAuthentication::Basic.encode_credentials("admin@example.com", "test-password") }
      end

      def photo
        fixture_file_upload("photo.jpg", "image/jpeg")
      end

      test "requires admin credentials" do
        post api_admin_event_types_url, params: { key: "gala", name: "Gala", image: photo }

        assert_response :unauthorized
        assert_nil EventType.find_by(key: "gala")
      end

      test "creates an event type with an uploaded image" do
        post api_admin_event_types_url, headers: auth_headers,
          params: { key: "gala", name: "Gala Dinner", summary: "Sân khấu LED", items: "Loa line array\nMàn hình LED", position: 3, image: photo }

        assert_response :created
        gala = EventType.find_by!(key: "gala")
        assert gala.image.attached?
        assert_equal [ "Loa line array", "Màn hình LED" ], gala.item_list
        assert response.parsed_body["image_url"].present?
      end

      test "rejects an event type without image or with a non-image file" do
        post api_admin_event_types_url, headers: auth_headers, params: { key: "gala", name: "Gala" }
        assert_response :unprocessable_content
        assert response.parsed_body["errors"].key?("image")

        post api_admin_event_types_url, headers: auth_headers,
          params: { key: "gala", name: "Gala", image: fixture_file_upload("note.txt", "text/plain") }
        assert_response :unprocessable_content
        assert response.parsed_body["errors"].key?("image")
      end

      test "rejects an invalid or duplicate key" do
        post api_admin_event_types_url, headers: auth_headers, params: { key: "Tiệc cưới", name: "X", image: photo }
        assert_response :unprocessable_content

        post api_admin_event_types_url, headers: auth_headers, params: { key: "wedding", name: "X", image: photo }
        assert_response :unprocessable_content
      end

      test "updates an event type, keeps the image when none is uploaded and can clear optional fields" do
        @wedding.update!(summary: "Cũ")
        blob_id = @wedding.image.blob.id

        patch api_admin_event_type_url(@wedding), headers: auth_headers, params: { name: "Tiệc cưới sang trọng", summary: "", key: "changed" }

        assert_response :ok
        @wedding.reload
        assert_equal "Tiệc cưới sang trọng", @wedding.name
        assert_equal "", @wedding.summary
        assert_equal "wedding", @wedding.key
        assert_equal blob_id, @wedding.image.blob.id
      end

      test "does not delete an event type that still has projects" do
        create_project(event_type: @wedding)

        delete api_admin_event_type_url(@wedding), headers: auth_headers

        assert_response :unprocessable_content
        assert EventType.exists?(@wedding.id)
      end

      test "deletes an unused event type" do
        delete api_admin_event_type_url(@wedding), headers: auth_headers

        assert_response :no_content
        assert_not EventType.exists?(@wedding.id)
      end

      test "creates, updates and deletes a project" do
        post api_admin_projects_url, headers: auth_headers,
          params: { title: "Tiệc cưới ven sông", event_type_id: @wedding.id, location: "TP. Huế", date_label: "12/2026", image: photo }
        assert_response :created
        project = Project.find(response.parsed_body["id"])
        assert_equal "wedding", response.parsed_body["category"]

        patch api_admin_project_url(project), headers: auth_headers, params: { title: "Tiệc cưới ven sông Hương" }
        assert_response :ok
        assert_equal "Tiệc cưới ven sông Hương", project.reload.title
        assert project.image.attached?

        delete api_admin_project_url(project), headers: auth_headers
        assert_response :no_content
        assert_not Project.exists?(project.id)
      end

      test "rejects a project without event type" do
        post api_admin_projects_url, headers: auth_headers, params: { title: "Không loại", image: photo }

        assert_response :unprocessable_content
        assert response.parsed_body["errors"].key?("event_type")
      end
    end
  end
end
