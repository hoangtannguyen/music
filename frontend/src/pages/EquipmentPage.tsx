import { useState } from "react";
import { Link } from "react-router";
import { useSiteContent } from "../SiteContent";
import EquipmentIcon from "../components/EquipmentIcon";
import FilterTabs from "../components/FilterTabs";
import PageHero from "../components/PageHero";

export default function EquipmentPage() {
  const { equipment, equipmentCategories } = useSiteContent();
  const [filter, setFilter] = useState("all");
  const items = equipment.filter((item) => filter === "all" || item.kind === filter);
  const categoryOptions = Object.fromEntries(equipmentCategories.map((category) => [category.key, category.name]));
  const iconFor = (kind: string) => equipmentCategories.find((category) => category.key === kind)?.icon;

  return (
    <>
      <PageHero
        title="Thiết bị cho thuê"
        description="Loa, micro, mixer, đèn sân khấu, màn hình LED và phụ kiện — thuê lẻ theo nhu cầu, có kỹ thuật viên hỗ trợ."
        image="1514525253161-7a46d19cd819"
      />

      <section className="section" aria-label="Danh sách thiết bị">
        <FilterTabs options={categoryOptions} value={filter} onChange={setFilter} label="Lọc theo loại thiết bị" />
        <div className="equip-grid">
          {items.map((item) => (
            <article key={item.id} className="equip-card">
              <EquipmentIcon className="equip-icon" icon={iconFor(item.kind)} />
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
