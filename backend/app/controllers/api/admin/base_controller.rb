module Api
  module Admin
    # Admin API base. Protected by HTTP Basic auth (email + password) against the
    # admins table; seed an account with bin/rails db:seed.
    class BaseController < ApplicationController
      include ActionController::HttpAuthentication::Basic::ControllerMethods

      rate_limit to: 60, within: 1.minute
      before_action :authenticate_admin

      private

      def authenticate_admin
        # authenticate_by takes the same time whether or not the email exists
        authenticated = authenticate_with_http_basic do |email, password|
          ::Admin.authenticate_by(email: email.strip.downcase, password: password)
        end
        # No WWW-Authenticate header, so the browser does not show its own login popup
        render json: { error: "Unauthorized" }, status: :unauthorized unless authenticated
      end

      def render_errors(record)
        render json: { errors: record.errors }, status: :unprocessable_content
      end
    end
  end
end
