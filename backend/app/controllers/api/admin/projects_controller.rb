module Api
  module Admin
    class ProjectsController < BaseController
      include ContentSerialization

      before_action :set_project, only: %i[update destroy]

      def index
        projects = Project.ordered.includes(:event_type).with_attached_image
        render json: projects.map { |project| project_json(project) }
      end

      def create
        project = Project.new(project_params)
        project.save ? render(json: project_json(project), status: :created) : render_errors(project)
      end

      def update
        @project.update(project_params) ? render(json: project_json(@project)) : render_errors(@project)
      end

      def destroy
        @project.destroy!
        head :no_content
      end

      private

      def set_project
        @project = Project.find(params[:id])
      end

      # Sent as multipart/form-data; image is optional on update (keeps the current one)
      def project_params
        params.permit(:title, :event_type_id, :location, :date_label, :position, :image).tap { |p| p.delete(:image) if p[:image].blank? }
      end
    end
  end
end
