require "net/http"
require "json"

# Action Mailer delivery method that sends through Brevo's HTTPS API.
# Used where outbound SMTP is blocked (e.g. Render free web services block ports 25/465/587).
# Docs: https://developers.brevo.com/reference/sendtransacemail
class BrevoDelivery
  ENDPOINT = URI("https://api.brevo.com/v3/smtp/email")

  class DeliveryError < StandardError; end

  attr_accessor :settings

  def initialize(settings)
    @settings = settings
  end

  def deliver!(mail)
    request = Net::HTTP::Post.new(ENDPOINT, "Content-Type" => "application/json", "Accept" => "application/json", "api-key" => api_key)
    request.body = JSON.generate(payload(mail))
    response = send_request(request)
    raise DeliveryError, "Brevo responded #{response.code}: #{response.body}" unless response.is_a?(Net::HTTPSuccess)

    response
  end

  private

  def send_request(request)
    Net::HTTP.start(ENDPOINT.host, ENDPOINT.port, use_ssl: true, open_timeout: 10, read_timeout: 15) do |http|
      http.request(request)
    end
  end

  def api_key
    settings[:api_key].presence || raise(DeliveryError, "BREVO_API_KEY is not set")
  end

  def payload(mail)
    sender = mail[:from].addrs.first
    {
      sender: { email: sender.address, name: sender.display_name }.compact,
      to: mail.to.map { |address| { email: address } },
      subject: mail.subject,
      htmlContent: part_body(mail, "text/html"),
      textContent: part_body(mail, "text/plain")
    }.compact
  end

  def part_body(mail, mime_type)
    part = mail.multipart? ? mail.parts.find { |p| p.mime_type == mime_type } : (mail if mail.mime_type == mime_type)
    part&.decoded
  end
end
