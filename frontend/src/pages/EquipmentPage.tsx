import { useState, type ReactNode } from "react";
import { Link } from "react-router";
import { equipmentTypes, type EquipmentType } from "../data/siteData";
import { useSiteContent } from "../SiteContent";
import FilterTabs from "../components/FilterTabs";
import PageHero from "../components/PageHero";

const equipmentIcons: Record<EquipmentType, ReactNode> = {
  speaker: <><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="14" r="4" /><circle cx="12" cy="6.5" r="1.5" /></>,
  mic: <><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" /></>,
  mixer: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 7v10M12 7v10M16 7v10" /><path d="M6.5 10h3M10.5 14h3M14.5 9h3" /></>,
  light: <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />,
  led: <><rect x="2" y="4" width="20" height="13" rx="1" /><path d="M8 21h8M12 17v4" /></>,
  accessory: <path d="M4 20 20 4M4 4l16 16M4 12h16M12 4v16" />
};

export default function EquipmentPage() {
  const { equipment } = useSiteContent();
  const [filter, setFilter] = useState("all");
  const items = equipment.filter((item) => filter === "all" || item.kind === filter);

  return (
    <>
      <PageHero
        title="Thiết bị cho thuê"
        description="Loa, micro, mixer, đèn sân khấu, màn hình LED và phụ kiện — thuê lẻ theo nhu cầu, có kỹ thuật viên hỗ trợ."
        image="1514525253161-7a46d19cd819"
      />

      <section className="section" aria-label="Danh sách thiết bị">
        <FilterTabs options={equipmentTypes} value={filter} onChange={setFilter} label="Lọc theo loại thiết bị" />
        <div className="equip-grid">
          {items.map((item) => (
            <article key={item.id} className="equip-card">
              <svg className="equip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {equipmentIcons[item.kind]}
              </svg>
              <h3>{item.name}</h3>
              <p className="equip-spec">{item.spec}</p>
              <p className="equip-desc">{item.description}</p>
              <Link className="button button-ghost button-sm" to={"/booking?item=" + item.id}>Báo giá thuê</Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
