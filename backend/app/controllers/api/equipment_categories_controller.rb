module Api
  class EquipmentCategoriesController < ApplicationController
    include ContentSerialization

    def index
      render json: EquipmentCategory.ordered.map { |category| equipment_category_json(category) }
    end
  end
end
