import type { CategoryKey } from "../data/siteData";
import { photo } from "../utils";

const cards: { key: CategoryKey; title: string; text: string; image: string }[] = [
  { key: "wedding", title: "Tiệc cưới", text: "Âm thanh ấm, ánh sáng lãng mạn cho ngày trọng đại.", image: "1519741497674-611481863552" },
  { key: "birthday", title: "Sinh nhật – Thôi nôi", text: "Gọn nhẹ, vui tươi cho tiệc gia đình.", image: "1530103862676-de8c9debad1d" },
  { key: "gala", title: "Gala Dinner", text: "Sân khấu LED, ánh sáng biểu diễn đẳng cấp.", image: "1519167758481-83f550bb49b3" },
  { key: "opening", title: "Khai trương", text: "Âm thanh mạnh, pháo giấy rộn ràng thu hút khách.", image: "1492684223066-81342ee5ff30" },
  { key: "conference", title: "Hội nghị", text: "Âm thanh rõ lời, trình chiếu sắc nét.", image: "1540575467063-178a50c2df87" },
  { key: "music", title: "Sự kiện âm nhạc", text: "Hệ thống biểu diễn cho liveshow, lễ hội.", image: "1470229722913-7c0e2dbbafd3" }
];

export default function CategorySection() {
  return (
    <section className="section" aria-labelledby="categories-title">
      <div className="section-head">
        <span className="kicker">Dịch vụ</span>
        <h2 id="categories-title">Giải pháp cho mọi loại sự kiện</h2>
        <p>Chọn loại sự kiện của bạn để xem thiết bị và gói combo phù hợp.</p>
      </div>
      <div className="category-grid">
        {cards.map((card) => (
          <a key={card.key} className="category-card" href={"services.html#" + card.key}>
            <img src={photo(card.image, 800)} alt="" loading="lazy" />
            <h3>{card.title}</h3><p>{card.text}</p><span className="more-link">Xem chi tiết →</span>
          </a>
        ))}
      </div>
    </section>
  );
}
