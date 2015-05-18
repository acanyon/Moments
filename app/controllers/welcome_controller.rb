class WelcomeController < ActionController::Base
    def index
    end

    def subscribe_mailinglist
        user = User.where(email: params[:email]).first || User.new
        user.email = params[:email]
        user.zipcode = user.zipcode || params[:zipcode]
        user.save!

        render json: { success: true }
    end
end

