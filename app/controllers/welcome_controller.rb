class WelcomeController < ActionController::Base
    def index
    end

    def subscribe_mailinglist
        user = User.where(email: params[:email]).first || User.new
        user.email = params[:email]
        user.zipcode = user.zipcode || params[:zipcode]

        mailchimp = Mailchimp::API.new(ENV['MAILCHIMP_API_KEY'])
        # subscribe to list, type: html, doube_optin=false, welcome_email=true
        mailchimp.lists.subscribe(ENV['MAILCHIMP_LIST_ID'], {email: params[:email]}, nil, 'html', false, false, true, true)

        user.save!

        render json: { success: true }
    end
end

