module Api
  module Admin
    # Admin API for quote/booking requests
    class LeadsController < BaseController
      PER_PAGE = 50

      def index
        leads = Lead.order(created_at: :desc)
        leads = leads.where(status: params[:status]) if Lead::STATUSES.include?(params[:status])
        page = [ params[:page].to_i, 1 ].max

        render json: {
          leads: leads.offset((page - 1) * PER_PAGE).limit(PER_PAGE).map { |lead| serialize(lead) },
          total: leads.count,
          page: page,
          per_page: PER_PAGE,
          counts: Lead.group(:status).count
        }
      end

      def update
        lead = Lead.find(params[:id])

        if lead.update(params.permit(:status))
          render json: serialize(lead)
        else
          render json: { errors: lead.errors }, status: :unprocessable_content
        end
      end

      private

      def serialize(lead)
        lead.as_json(only: %i[id service event_date guests location phone name note source status created_at])
          .merge("equipment" => lead.equipment.to_s.split(","))
      end
    end
  end
end
