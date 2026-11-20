class ApplicationMailer < ActionMailer::Base
  # The sender must be a verified sender in Brevo (or the SMTP account itself)
  default from: -> { email_address_with_name(ENV["MAIL_FROM"].presence || ENV["SMTP_USERNAME"], "Event Pro") }
  layout "mailer"
end
