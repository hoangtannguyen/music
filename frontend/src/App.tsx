import { useEffect, useRef, useState } from "react";
import { siteData } from "./data/siteData";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ServiceHighlights from "./components/ServiceHighlights";
import CategorySection from "./components/CategorySection";
import ComboCard from "./components/ComboCard";
import ProjectCard from "./components/ProjectCard";
import QuoteForm from "./components/QuoteForm";
import TrustBar from "./components/TrustBar";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";

const PROJECT_LIMIT = 6;

export default function App() {
  const [toast, setToast] = useState({ message: "", show: false });
  const toastTimer = useRef<number>(undefined);

  function showToast(message: string) {
    window.clearTimeout(toastTimer.current);
    setToast({ message, show: true });
    toastTimer.current = window.setTimeout(() => setToast((current) => ({ ...current, show: false })), 4500);
  }

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const featuredCombos = siteData.combos.filter((combo) => combo.featured);

  return (
    <>
      <div className="site-shell">
        <Header />

        <main>
          <Hero />
          <ServiceHighlights />
          <CategorySection />

          <section className="section section-alt" aria-labelledby="combos-title">
            <div className="section-head">
              <span className="kicker">Gói combo</span>
              <h2 id="combos-title">Combo trọn gói được chọn nhiều nhất</h2>
              <p>Thiết bị đã kết hợp sẵn, kèm kỹ thuật viên — tiết kiệm hơn thuê lẻ.</p>
            </div>
            <div className="card-grid" id="combo-list">
              {featuredCombos.map((combo) => <ComboCard key={combo.id} combo={combo} />)}
            </div>
            <div className="section-cta"><a className="button button-dark" href="combos.html">Xem tất cả combo →</a></div>
          </section>

          <section className="section" aria-labelledby="projects-title">
            <div className="section-head">
              <span className="kicker">Dự án</span>
              <h2 id="projects-title">Sự kiện chúng tôi đã thực hiện</h2>
              <p>Một vài khoảnh khắc từ các tiệc cưới, gala và sự kiện gần đây.</p>
            </div>
            <div className="gallery" id="project-list">
              {siteData.projects.slice(0, PROJECT_LIMIT).map((project) => <ProjectCard key={project.title} project={project} />)}
            </div>
            <div className="section-cta"><a className="button button-ghost" href="projects.html">Xem thư viện dự án →</a></div>
          </section>

          <QuoteForm onToast={showToast} />
          <TrustBar />
        </main>

        <Footer />
      </div>

      <FloatingContact />
      <div className={"toast" + (toast.show ? " show" : "")} role="status" aria-live="polite">{toast.message}</div>
    </>
  );
}
