import { Link } from "react-router";
import { useSiteContent } from "../SiteContent";

export default function CategorySection() {
  const { eventTypes } = useSiteContent();

  return (
    <section className="section" aria-labelledby="categories-title">
      <div className="section-head">
        <span className="kicker">Dịch vụ</span>
        <h2 id="categories-title">Giải pháp cho mọi loại sự kiện</h2>
        <p>Chọn loại sự kiện của bạn để xem thiết bị phù hợp.</p>
      </div>
      <div className="category-grid">
        {eventTypes.map((eventType) => (
          <Link key={eventType.key} className="category-card" to={"/services#" + eventType.key}>
            {eventType.image_url && <img src={eventType.image_url} alt="" loading="lazy" />}
            <h3>{eventType.name}</h3><p>{eventType.summary}</p><span className="more-link">Xem chi tiết →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
