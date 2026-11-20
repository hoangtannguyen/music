import { useEffect, useRef, useState } from "react";
import type { Project } from "../contentApi";
import ProjectCard from "./ProjectCard";

export default function ProjectGallery({ projects }: { projects: Project[] }) {
  const [selected, setSelected] = useState<Project | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement>(null);

  function open(project: Project, trigger: HTMLElement) {
    lastFocus.current = trigger;
    setSelected(project);
  }

  function close() {
    setSelected(null);
    lastFocus.current?.focus();
  }

  useEffect(() => {
    if (!selected) return;
    closeButton.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [selected]);

  return (
    <>
      <div className="gallery">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} onOpen={open} />
        ))}
        {projects.length === 0 && <p className="empty-note">Chưa có dự án cho mục này.</p>}
      </div>

      <div
        className={"lightbox" + (selected ? " open" : "")}
        role="dialog"
        aria-modal="true"
        aria-label="Xem ảnh dự án"
        aria-hidden={!selected}
        onClick={(event) => { if (event.target === event.currentTarget) close(); }}
      >
        <button ref={closeButton} className="lightbox-close" type="button" aria-label="Đóng" onClick={close}>×</button>
        {selected && (
          <figure>
            {selected.image_url && <img src={selected.image_url} alt={selected.title} />}
            <figcaption>{[selected.title, selected.location, selected.date_label].filter(Boolean).join(" · ")}</figcaption>
          </figure>
        )}
      </div>
    </>
  );
}
