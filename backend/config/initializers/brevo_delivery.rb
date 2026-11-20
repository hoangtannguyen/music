# Register the :brevo delivery method (lib/delivery_methods/brevo_delivery.rb).
# The environment configs pick it when BREVO_API_KEY is set.
require Rails.root.join("lib/delivery_methods/brevo_delivery")

ActiveSupport.on_load(:action_mailer) do
  add_delivery_method :brevo, BrevoDelivery, api_key: ENV["BREVO_API_KEY"]
end
