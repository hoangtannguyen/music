ENV["RAILS_ENV"] ||= "test"
require_relative "../config/environment"
require "rails/test_help"

module ActiveSupport
  class TestCase
    # Run tests in parallel with specified workers
    parallelize(workers: :number_of_processors, with: :threads)

    # Setup all fixtures in test/fixtures/*.yml for all tests in alphabetical order.
    fixtures :all

    def create_event_type(key: "wedding", name: "Tiệc cưới", **attributes)
      EventType.new(key: key, name: name, **attributes).tap do |event_type|
        event_type.image.attach(io: file_fixture("photo.jpg").open, filename: "photo.jpg", content_type: "image/jpeg")
        event_type.save!
      end
    end

    def create_project(event_type:, title: "Tiệc cưới ngoài trời", **attributes)
      Project.new(event_type: event_type, title: title, **attributes).tap do |project|
        project.image.attach(io: file_fixture("photo.jpg").open, filename: "photo.jpg", content_type: "image/jpeg")
        project.save!
      end
    end
  end
end
