class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  def is_signed_in
      if current_user
          render json: { is_signed_in: true }
      else 
          result = '{"auth_input": "<input name=\'authenticity_token\' value=\'<%= form_authenticity_token %>\' type=\'hidden\'>", ' +
                    '"authenticity_token": "<%= form_authenticity_token %>", ' +
                    '"is_signed_in": false}'
          render inline: result, content_type: 'application/json'
      end

  end


  def mobile
      render inline: '<%= render :file => "/Users/acanyon/moments_photo_share/moments_mobile/www/index", :layout => false %>' 
  end

end
