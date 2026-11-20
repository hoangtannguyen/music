# Be sure to restart your server when you modify this file.

# Allow the React frontend to post leads. Set FRONTEND_ORIGINS (comma-separated) in production.
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*ENV.fetch("FRONTEND_ORIGINS", "http://localhost:5173").split(","))

    resource "/api/*",
      headers: :any,
      methods: [ :post, :options ]
  end
end
