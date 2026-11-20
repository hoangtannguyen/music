import { siteData, type Project } from "../data/siteData";
import { photo } from "../utils";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <button className="gallery-item" type="button" data-category={project.category}>
      <img src={photo(project.image, 800)} alt={project.title} loading="lazy" />
      <span className="gallery-caption">
        <strong>{project.title}</strong>
        <span>{siteData.categories[project.category]} · {project.location} · {project.date}</span>
      </span>
    </button>
  );
}
