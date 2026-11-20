module Api
  class ProjectsController < ApplicationController
    include ContentSerialization

    def index
      projects = Project.ordered.includes(:event_type).with_attached_image
      render json: projects.map { |project| project_json(project) }
    end
  end
end
