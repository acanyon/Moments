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

    # POST create new moment
    def create
    end

    # view moment
    def show
    end

    # delete moment
    def destroy
    end

    private

    def require_authenticated_user
        if !user_signed_in?
            render plain: 'Access denied. Please <a href="/users/sign_in">Log In</a>',
                   status: 401
        end
    end
end
