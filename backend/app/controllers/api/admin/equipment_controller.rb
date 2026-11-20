module Api
  module Admin
    class EquipmentController < BaseController
      include ContentSerialization

      before_action :set_equipment, only: %i[update destroy]

      def index
        render json: Equipment.ordered.map { |equipment| equipment_json(equipment) }
      end

      def create
        equipment = Equipment.new(equipment_params)
        equipment.save ? render(json: equipment_json(equipment), status: :created) : render_errors(equipment)
      end

      def update
        @equipment.update(equipment_params) ? render(json: equipment_json(@equipment)) : render_errors(@equipment)
      end

      def destroy
        @equipment.destroy!
        head :no_content
      end

      private

      def set_equipment
        @equipment = Equipment.find(params[:id])
      end

      def equipment_params
        params.permit(:name, :kind, :spec, :description, :position)
      end
    end
  end
end
