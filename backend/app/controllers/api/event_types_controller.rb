module Api
  class EventTypesController < ApplicationController
    include ContentSerialization

    def index
      render json: EventType.ordered.with_attached_image.map { |event_type| event_type_json(event_type) }
    end
  end
end
