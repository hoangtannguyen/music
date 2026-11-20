import { useEffect } from "react";
import { Link, useLocation } from "react-router";
import { useSiteContent } from "../SiteContent";
import PageHero from "../components/PageHero";

export default function ServicesPage() {
  const { eventTypes } = useSiteContent();
  const { hash } = useLocation();

  // Sections render after the API responds, so scroll to /services#<key> once they exist
  useEffect(() => {
    if (hash && eventTypes.length) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
  }, [hash, eventTypes.length]);

  return (
    <>
      <PageHero
        title="Dịch vụ"
        description="Âm thanh, ánh sáng, màn hình LED và kỹ thuật viên vận hành cho từng loại sự kiện."
        image="1470229722913-7c0e2dbbafd3"
      />

      <div>
        {eventTypes.map((eventType, index) => (
          <section key={eventType.key} id={eventType.key} className={"service-detail" + (index % 2 ? " reverse" : "")}>
            <div className="service-media">
              {eventType.image_url && <img src={eventType.image_url} alt={eventType.name} loading="lazy" />}
            </div>
            <div className="service-text">
              {eventType.guests && <span className="kicker">{eventType.guests}</span>}
              <h2>{eventType.name}</h2>
              <p>{eventType.description || eventType.summary}</p>
              {eventType.items.length > 0 && (
                <ul className="tag-list" aria-label="Thiết bị gợi ý">
                  {eventType.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              )}
              <div className="service-actions">
                <Link className="button button-primary" to={"/booking?service=" + encodeURIComponent(eventType.key)}>Nhận báo giá</Link>
                <a className="button button-ghost" href="tel:0987654321">Gọi tư vấn</a>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
