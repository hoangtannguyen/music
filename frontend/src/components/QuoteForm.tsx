import { guestRanges } from "../data/siteData";
import { useSiteContent } from "../SiteContent";
import { useLeadSubmit } from "../useLeadSubmit";
import { todayIso } from "../utils";
import DatePicker from "./DatePicker";

export default function QuoteForm({ onToast }: { onToast: (message: string) => void }) {
  const { eventTypes } = useSiteContent();
  const { submitting, handleSubmit } = useLeadSubmit(onToast);

  return (
    <section className="quote-wrap" id="quote">
      <div className="quote-card">
        <div className="quote-photo" role="img" aria-label="Không gian tiệc cưới được trang trí lung linh"></div>
        <div className="quote-content">
          <div className="title-rule"></div>
          <h2>Nhận báo giá nhanh</h2>
          <p>Để lại thông tin, chúng tôi gọi lại tư vấn và gửi báo giá chi tiết sớm nhất.</p>
          <form className="quote-form" id="quote-form" onSubmit={handleSubmit}>
            <input type="hidden" name="source" value="home-quick-quote" />
            <label className="field">
              <span aria-hidden="true">▦</span>
              <select name="service" required aria-label="Loại sự kiện" defaultValue="">
                <option value="" disabled>Loại sự kiện</option>
                {eventTypes.map((eventType) => (
                  <option key={eventType.key} value={eventType.key}>{eventType.name}</option>
                ))}
              </select>
            </label>
            <div className="field">
              <span aria-hidden="true">▦</span>
              <DatePicker name="date" ariaLabel="Ngày tổ chức" placeholder="Ngày tổ chức" min={todayIso()} required />
            </div>
            <label className="field">
              <span aria-hidden="true">♟</span>
              <select name="guests" required aria-label="Số lượng khách" defaultValue="">
                <option value="" disabled>Số lượng khách</option>
                {guestRanges.map((range) => <option key={range}>{range}</option>)}
              </select>
            </label>
            <label className="field">
              <span aria-hidden="true">⌖</span>
              <input type="text" name="location" placeholder="Địa điểm tổ chức" aria-label="Địa điểm tổ chức" required />
            </label>
            <label className="field">
              <span aria-hidden="true">☎</span>
              <input type="tel" name="phone" placeholder="Số điện thoại của bạn" aria-label="Số điện thoại" autoComplete="tel" pattern="[0-9+().\-\s]{9,16}" title="Vui lòng nhập số điện thoại hợp lệ" required />
            </label>
            <button className="submit-button" type="submit" disabled={submitting}><span aria-hidden="true">➤</span> &nbsp;Gửi yêu cầu</button>
          </form>
        </div>
      </div>
    </section>
  );
}
