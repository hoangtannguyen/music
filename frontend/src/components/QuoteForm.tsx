import { useState, type FormEvent } from "react";
import { siteData } from "../data/siteData";
import { submitLead, todayIso } from "../utils";

export default function QuoteForm({ onToast }: { onToast: (message: string) => void }) {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    setSubmitting(true);
    try {
      await submitLead(form);
      onToast("Cảm ơn bạn! Event Pro đã nhận yêu cầu và sẽ liên hệ báo giá trong thời gian sớm nhất.");
      form.reset();
    } catch {
      onToast("Gửi chưa thành công. Vui lòng gọi hotline 0987 654 321 hoặc nhắn Zalo để được hỗ trợ ngay.");
    } finally {
      setSubmitting(false);
    }
  }

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
                {Object.entries(siteData.categories).map(([key, name]) => (
                  <option key={key} value={key}>{name}</option>
                ))}
              </select>
            </label>
            <label className="field">
              <span aria-hidden="true">▦</span>
              <input type="date" name="date" aria-label="Ngày tổ chức" min={todayIso()} required />
            </label>
            <label className="field">
              <span aria-hidden="true">♟</span>
              <select name="guests" required aria-label="Số lượng khách" defaultValue="">
                <option value="" disabled>Số lượng khách</option>
                <option>Dưới 100 khách</option>
                <option>100 - 300 khách</option>
                <option>300 - 500 khách</option>
                <option>Trên 500 khách</option>
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
