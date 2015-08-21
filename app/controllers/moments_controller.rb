class MomentsController < ApplicationController
    before_action :require_authenticated_user

    # all moments for given user
    def index
#        sample_response = [{ 
#            id: 109,
#            username: 'leannagrand', members: ['gracetherope', 'karlinthehouse'], description: 'Summer fun as a raft guide. ::emoji::',
#            posted_on: '2hrs', view_count: 12, comment_count: 5,
#            photos: [
#                { snaps: 2, src: 'img/moments/leannagrand_1.jpg',
#                  comments: [{ username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'},
#                             { username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'}] },
#                { snaps: 8, src: 'img/moments/leannagrand_2.jpg',
#                  comments: [] },
#                { snaps: 0, src: 'img/moments/leannagrand_3.jpg',
#                  comments: [] },
#            ]
#        }, {
#            id: 88,
#            username: 'leannagrand', members: ['gracetherope', 'karlinthehouse'], description: 'Summer fun as a raft guide. ::emoji::',
#            posted_on: '2hrs', view_count: 12, comment_count: 5,
#            photos: [
#                { snaps: 2, src: 'img/moments/leannagrand_1.jpg',
#                  comments: [{ username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'},
#                             { username: 'acanyon', comment: 'Best raft guide ever. Hope to visit again!'}] },
#                { snaps: 8, src: 'img/moments/leannagrand_2.jpg',
#                  comments: [] },
#                { snaps: 0, src: 'img/moments/leannagrand_3.jpg',
#                  comments: [] },
#            ]
#        }]   

        render json: current_user.moments.as_json
    end
    
    def test_create
#        response.headers['Access-Control-Allow-Origin'] = '*'
#        response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS'
    end

    # POST create new moment
    def create
        s3 = Aws::S3::Resource.new(region:'us-west-2')
        moment = Moment.new()
        moment.user_id = current_user.id
        moment.status = :pending
        moment.description = params[:description]

        s3 = Aws::S3::Resource.new(region:'us-west-2')
        obj = s3.bucket('moments-mobile-dev').object('/example_upload.jpg')
        obj.upload_file('/Users/acanyon/moments_photo_share/moments_mobile/www/img/moments/leannagrand_1.jpg')

        photo_urls = []
        photo_count = params[:photo_count].try(:to_i)
        (0...photo_count).each do 
            # TODO - create name w/o conflicts
            #      - add extention?
            o = [('a'..'z'),('A'..'Z')].map{ |i| i.to_a }.flatten
            photo_name = (0..16).map{ o[rand(o.length)] }.join
            s3_bucket_photo = s3.bucket('moments-mobile-dev').object(photo_name)
            signed_url = s3_bucket_photo.presigned_url(:put)
            photo_urls.push(signed_url)
        end
        moment.save!

        render json: {photo_urls: photo_urls, success: true}
    end

    # view moment
    def show
    end

    # delete moment
    def destroy
    end

    private

    def new_moment_params
        params.require(:moment).permit(:user_id, :caption)
    end

    def require_authenticated_user
        if !user_signed_in?
            render plain: 'Access denied. Please <a href="/users/sign_in">Log In</a>',
                   status: 401
        end
    end
end
