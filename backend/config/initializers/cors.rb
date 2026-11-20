# Be sure to restart your server when you modify this file.

# Allow the React frontend to call the API. Set FRONTEND_ORIGINS (comma-separated) in production;
# without it, development accepts any localhost port (Vite moves to 5174+ when 5173 is busy).
frontend_origins =
  if ENV["FRONTEND_ORIGINS"].present?
    ENV["FRONTEND_ORIGINS"].split(",")
  elsif Rails.env.development?
    [ %r{\Ahttp://(localhost|127\.0\.0\.1):\d+\z} ]
  else
    [ "http://localhost:5173" ]
  end

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins(*frontend_origins)

    resource "/api/*",
      headers: :any,
      methods: [ :get, :post, :patch, :delete, :options ]
  end
end
