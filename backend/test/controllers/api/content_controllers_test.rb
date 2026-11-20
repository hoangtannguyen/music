require "test_helper"

module Api
  class ContentControllersTest < ActionDispatch::IntegrationTest
    setup do
      @music = create_event_type(key: "music", name: "Sự kiện âm nhạc", position: 2, items: "Line array\n\nMixer digital\n")
      @wedding = create_event_type(key: "wedding", name: "Tiệc cưới", position: 1)
      create_project(event_type: @music, title: "Liveshow", position: 2)
      create_project(event_type: @wedding, title: "Tiệc cưới tại nhà hàng", position: 1, location: "TP. Huế", date_label: "09/2026")
    end

    test "lists event types by position with items and image url" do
      get api_event_types_url

      assert_response :ok
      body = response.parsed_body
      assert_equal %w[wedding music], body.map { |event_type| event_type["key"] }
      assert_equal [ "Line array", "Mixer digital" ], body.last["items"]
      assert_match %r{/rails/active_storage/blobs/}, body.first["image_url"]
    end

    test "lists projects by position with their category key" do
      get api_projects_url

      assert_response :ok
      first = response.parsed_body.first
      assert_equal "Tiệc cưới tại nhà hàng", first["title"]
      assert_equal "wedding", first["category"]
      assert_equal "09/2026", first["date_label"]
      assert first["image_url"].present?
    end
  end
end
