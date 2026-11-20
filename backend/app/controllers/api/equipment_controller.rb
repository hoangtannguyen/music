module Api
  class EquipmentController < ApplicationController
    include ContentSerialization

    def index
      render json: Equipment.ordered.map { |equipment| equipment_json(equipment) }
    end
  end
end
