import type { Project } from "../contentApi";
import { useSiteContent } from "../SiteContent";

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project, trigger: HTMLElement) => void;
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { categoryName } = useSiteContent();
  const meta = [categoryName(project.category), project.location, project.date_label].filter(Boolean).join(" · ");

  return (
    <button className="gallery-item" type="button" data-category={project.category} onClick={(event) => onOpen(project, event.currentTarget)}>
      {project.image_url && <img src={project.image_url} alt={project.title} loading="lazy" />}
      <span className="gallery-caption">
        <strong>{project.title}</strong>
        <span>{meta}</span>
      </span>
    </button>
  );
}
