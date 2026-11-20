import { siteData, type Combo } from "../data/siteData";
import { photo } from "../utils";

export default function ComboCard({ combo }: { combo: Combo }) {
  return (
    <article className="combo-card" data-category={combo.category}>
      <div className="combo-media">
        <img src={photo(combo.image, 800)} alt={combo.name} loading="lazy" />
        {combo.badge && <span className="badge">{combo.badge}</span>}
      </div>
      <div className="combo-body">
        <span className="combo-meta">{siteData.categories[combo.category]} · {combo.guests}</span>
        <h3>{combo.name}</h3>
        <p>{combo.description}</p>
        <ul className="check-list">
          {combo.items.map((item) => <li key={item}>{item}</li>)}
        </ul>
        <div className="combo-foot">
          <span className="price">Giá tham khảo<strong>{combo.price}</strong></span>
          <a className="button button-primary button-sm" href={"booking.html?combo=" + encodeURIComponent(combo.id)}>Yêu cầu báo giá</a>
        </div>
      </div>
    </article>
  );
}
