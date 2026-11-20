module Api
  module Admin
    class EventTypesController < BaseController
      include ContentSerialization

      before_action :set_event_type, only: %i[update destroy]

      def index
        render json: EventType.ordered.with_attached_image.map { |event_type| event_type_json(event_type) }
      end

      def create
        event_type = EventType.new(event_type_params.merge(params.permit(:key)))
        event_type.save ? render(json: event_type_json(event_type), status: :created) : render_errors(event_type)
      end

      def update
        @event_type.update(event_type_params) ? render(json: event_type_json(@event_type)) : render_errors(@event_type)
      end

      def destroy
        @event_type.destroy ? head(:no_content) : render_errors(@event_type)
      end

      private

      def set_event_type
        @event_type = EventType.find(params[:id])
      end

      # Sent as multipart/form-data; image is optional on update (keeps the current one)
      def event_type_params
        params.permit(:name, :summary, :description, :guests, :items, :position, :image).tap { |p| p.delete(:image) if p[:image].blank? }
      end
    end
  end
end
