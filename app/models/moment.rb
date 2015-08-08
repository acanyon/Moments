class Moment < ActiveRecord::Base
    belongs_to :user
    has_and_belongs_to_many :members, through: :users_moments
end
