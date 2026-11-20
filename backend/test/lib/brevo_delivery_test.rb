require "test_helper"

class BrevoDeliveryTest < ActiveSupport::TestCase
  # Records the request instead of calling the real API
  class RecordingDelivery < BrevoDelivery
    attr_reader :request

    def initialize(settings, response)
      super(settings)
      @response = response
    end

    private

    def send_request(request)
      @request = request
      @response
    end
  end

  def build_mail
    Mail.new do
      from "Event Pro <owner@example.com>"
      to "owner@example.com"
      subject "Yêu cầu báo giá mới #1"
      text_part { body "Khách: Nguyễn Văn A" }
      html_part do
        content_type "text/html; charset=UTF-8"
        body "<p>Khách: Nguyễn Văn A</p>"
      end
    end
  end

  # Net::HTTP response with an already-read body, like the ones returned by Net::HTTP#request
  def http_response(klass, code, body)
    klass.new("1.1", code, "").tap do |response|
      response.instance_variable_set(:@read, true)
      response.instance_variable_set(:@body, body)
    end
  end

  def deliver_with(response, api_key: "test-key")
    RecordingDelivery.new({ api_key: api_key }, response).tap { |delivery| delivery.deliver!(build_mail) }
  end

  test "posts the email to the Brevo API with the api-key header" do
    delivery = deliver_with(http_response(Net::HTTPCreated, "201", %({"messageId":"<1@relay>"})))

    request = delivery.request
    assert_equal "/v3/smtp/email", request.path
    assert_equal "test-key", request["api-key"]
    body = JSON.parse(request.body)
    assert_equal({ "email" => "owner@example.com", "name" => "Event Pro" }, body["sender"])
    assert_equal [ { "email" => "owner@example.com" } ], body["to"]
    assert_equal "Yêu cầu báo giá mới #1", body["subject"]
    assert_includes body["textContent"], "Nguyễn Văn A"
    assert_includes body["htmlContent"], "<p>Khách: Nguyễn Văn A</p>"
  end

  test "raises when Brevo rejects the request" do
    error = assert_raises(BrevoDelivery::DeliveryError) do
      deliver_with(http_response(Net::HTTPUnauthorized, "401", %({"code":"unauthorized","message":"Key not found"})))
    end
    assert_match "401", error.message
  end

  test "raises when the api key is missing" do
    assert_raises(BrevoDelivery::DeliveryError) { deliver_with(http_response(Net::HTTPCreated, "201", %({"messageId":"<1@relay>"})), api_key: nil) }
  end
end
