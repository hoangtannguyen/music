import { useState } from "react";
import { useSiteContent } from "../SiteContent";
import FilterTabs from "../components/FilterTabs";
import PageHero from "../components/PageHero";
import ProjectGallery from "../components/ProjectGallery";

export default function ProjectsPage() {
  const { eventTypes, projects } = useSiteContent();
  const [filter, setFilter] = useState("all");
  const visible = projects.filter((project) => filter === "all" || project.category === filter);
  const categories = Object.fromEntries(eventTypes.map((eventType) => [eventType.key, eventType.name]));

  return (
    <>
      <PageHero
        title="Dự án đã thực hiện"
        description="Tiệc cưới, gala, hội nghị và đêm nhạc mà Event Pro đã phục vụ tại Huế và các tỉnh lân cận."
        image="1519167758481-83f550bb49b3"
      />

      <section className="section" aria-label="Thư viện dự án">
        <FilterTabs options={categories} value={filter} onChange={setFilter} label="Lọc theo loại sự kiện" />
        <ProjectGallery projects={visible} />
      </section>
    </>
  );
}
