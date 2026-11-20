module Api
  class LeadsController < ApplicationController
    rate_limit to: 5, within: 1.minute, only: :create

    def create
      lead = Lead.new(lead_params)

      if lead.save
        # Sent in the background: an SMTP failure must not fail the customer's request
        LeadMailer.new_lead(lead).deliver_later if LeadMailer.enabled?
        render json: { id: lead.id }, status: :created
      else
        render json: { errors: lead.errors }, status: :unprocessable_content
      end
    end

    private

    # The frontend posts the form fields at the top level (form-encoded), with "date" for the event date
    # and "equipment[]" checkboxes on the booking page
    def lead_params
      permitted = params.permit(:service, :date, :guests, :location, :phone, :source, :name, :note, equipment: [])
      permitted.slice(:service, :guests, :location, :phone, :source, :name, :note)
        .merge(event_date: permitted[:date], equipment: Array(permitted[:equipment]).join(",").presence)
    end
  end
end
