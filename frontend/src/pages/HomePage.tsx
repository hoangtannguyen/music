import { Link } from "react-router";
import { useSiteContent } from "../SiteContent";
import Hero from "../components/Hero";
import ServiceHighlights from "../components/ServiceHighlights";
import CategorySection from "../components/CategorySection";
import ProjectGallery from "../components/ProjectGallery";
import QuoteForm from "../components/QuoteForm";
import TrustBar from "../components/TrustBar";

const PROJECT_LIMIT = 6;

export default function HomePage({ onToast }: { onToast: (message: string) => void }) {
  const { projects } = useSiteContent();

  return (
    <>
      <Hero />
      <ServiceHighlights />
      <CategorySection />

      <section className="section" aria-labelledby="projects-title">
        <div className="section-head">
          <span className="kicker">Dự án</span>
          <h2 id="projects-title">Sự kiện chúng tôi đã thực hiện</h2>
          <p>Một vài khoảnh khắc từ các tiệc cưới, gala và sự kiện gần đây.</p>
        </div>
        <ProjectGallery projects={projects.slice(0, PROJECT_LIMIT)} />
        <div className="section-cta"><Link className="button button-ghost" to="/projects">Xem thư viện dự án →</Link></div>
      </section>

      <QuoteForm onToast={onToast} />
      <TrustBar />
    </>
  );
}
