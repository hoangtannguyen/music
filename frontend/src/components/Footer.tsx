import { Link } from "react-router";
import { useSiteContent } from "../SiteContent";
import Brand from "./Brand";

export default function Footer() {
  const { eventTypes } = useSiteContent();

  return (
    <footer className="site-footer" id="contact">
      <div className="footer-grid">
        <div className="footer-brand">
          <Brand />
          <p>Cho thuê âm thanh, ánh sáng, màn hình LED trọn gói cho tiệc cưới và sự kiện tại Huế và các tỉnh lân cận.</p>
        </div>
        <div>
          <h3>Dịch vụ</h3>
          <ul>
            {eventTypes.map((eventType) => (
              <li key={eventType.key}><Link to={"/services#" + eventType.key}>{eventType.name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Khám phá</h3>
          <ul>
            <li><Link to="/equipment">Thiết bị cho thuê</Link></li>
            <li><Link to="/projects">Dự án đã thực hiện</Link></li>
            <li><Link to="/booking">Đặt thuê &amp; báo giá</Link></li>
          </ul>
        </div>
        <div>
          <h3>Liên hệ</h3>
          <ul>
            <li>Hotline: <a href="tel:0987654321">0987 654 321</a></li>
            <li>Zalo: <a href="https://zalo.me/0987654321" target="_blank" rel="noopener">0987 654 321</a></li>
            <li>Khu vực: TP. Huế và các tỉnh lân cận</li>
            <li>Hỗ trợ 24/7</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Event Pro. Âm thanh · Ánh sáng · Sự kiện.</div>
    </footer>
  );
}
