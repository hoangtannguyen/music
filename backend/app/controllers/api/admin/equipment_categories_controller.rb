module Api
  module Admin
    class EquipmentCategoriesController < BaseController
      include ContentSerialization

      before_action :set_category, only: %i[update destroy]

      def index
        render json: EquipmentCategory.ordered.map { |category| equipment_category_json(category) }
      end

      def create
        category = EquipmentCategory.new(category_params.merge(params.permit(:key)))
        category.save ? render(json: equipment_category_json(category), status: :created) : render_errors(category)
      end

      def update
        @category.update(category_params) ? render(json: equipment_category_json(@category)) : render_errors(@category)
      end

      def destroy
        @category.destroy ? head(:no_content) : render_errors(@category)
      end

      private

      def set_category
        @category = EquipmentCategory.find(params[:id])
      end

      def category_params
        params.permit(:name, :icon, :position)
      end
    end
  end
end
