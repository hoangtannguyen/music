import { useSearchParams } from "react-router";
import { equipmentTypes, guestRanges } from "../data/siteData";
import { useSiteContent } from "../SiteContent";
import DatePicker from "../components/DatePicker";
import PageHero from "../components/PageHero";
import { useLeadSubmit } from "../useLeadSubmit";
import { todayIso } from "../utils";

export default function BookingPage({ onToast }: { onToast: (message: string) => void }) {
  const [params] = useSearchParams();
  const { eventTypes, equipment } = useSiteContent();
  const { submitting, handleSubmit } = useLeadSubmit(onToast);

  // Prefill from ?service=<event type key> (services page) or ?item=<equipment id> (equipment page)
  const service = params.get("service") ?? "";
  const presetService = eventTypes.some((eventType) => eventType.key === service) ? service : "";
  const presetItem = equipment.find((item) => String(item.id) === params.get("item"));

  return (
    <>
      <PageHero
        title="Đặt thuê & báo giá"
        description="Điền thông tin sự kiện, chúng tôi gọi lại tư vấn và gửi báo giá chi tiết trong thời gian sớm nhất."
        image="1464366400600-7168b8af9bc3"
      />

      <section className="section">
        <div className="booking-layout">
          {/* key: remount with new defaults when the query string changes or event types finish loading */}
          <form key={params.toString() + "/" + eventTypes.length + "/" + equipment.length} className="booking-form" onSubmit={handleSubmit}>
            <input type="hidden" name="source" value="booking-page" />

            <div className="form-section">
              <h2><span className="step-num">1</span>Thông tin sự kiện</h2>
              <div className="form-grid">
                <label className="form-group">
                  <span className="form-label">Loại sự kiện <span className="req">*</span></span>
                  <select className="input" name="service" required defaultValue={presetService}>
                    <option value="" disabled>Chọn loại sự kiện</option>
                    {eventTypes.map((eventType) => (
                      <option key={eventType.key} value={eventType.key}>{eventType.name}</option>
                    ))}
                  </select>
                </label>
                <div className="form-group">
                  <span className="form-label">Ngày tổ chức <span className="req">*</span></span>
                  <DatePicker className="input" name="date" ariaLabel="Ngày tổ chức" placeholder="Chọn ngày tổ chức" min={todayIso()} required />
                </div>
                <label className="form-group">
                  <span className="form-label">Số lượng khách <span className="req">*</span></span>
                  <select className="input" name="guests" required defaultValue="">
                    <option value="" disabled>Chọn số lượng khách</option>
                    {guestRanges.map((range) => <option key={range}>{range}</option>)}
                  </select>
                </label>
                <label className="form-group">
                  <span className="form-label">Địa điểm tổ chức <span className="req">*</span></span>
                  <input className="input" type="text" name="location" placeholder="VD: Nhà hàng ABC, TP. Huế" maxLength={255} required />
                </label>
              </div>
            </div>

            <div className="form-section">
              <h2><span className="step-num">2</span>Thiết bị cần thuê</h2>
              <div className="check-grid">
                {Object.entries(equipmentTypes).map(([key, name]) => (
                  <label key={key} className="check-chip">
                    <input type="checkbox" name="equipment[]" value={key} defaultChecked={presetItem?.kind === key} />
                    <span>{name}</span>
                  </label>
                ))}
              </div>
              <label className="form-group full" style={{ marginTop: 14 }}>
                <span className="form-label">Ghi chú thêm</span>
                <textarea
                  className="input"
                  name="note"
                  maxLength={1000}
                  placeholder="Yêu cầu riêng về thiết bị, thời gian lắp đặt, chương trình…"
                  defaultValue={presetItem ? "Thiết bị quan tâm: " + presetItem.name : ""}
                />
              </label>
            </div>

            <div className="form-section">
              <h2><span className="step-num">3</span>Thông tin liên hệ</h2>
              <div className="form-grid">
                <label className="form-group">
                  <span className="form-label">Họ và tên</span>
                  <input className="input" type="text" name="name" autoComplete="name" maxLength={100} />
                </label>
                <label className="form-group">
                  <span className="form-label">Số điện thoại <span className="req">*</span></span>
                  <input className="input" type="tel" name="phone" autoComplete="tel" pattern="[0-9+().\-\s]{9,16}" title="Vui lòng nhập số điện thoại hợp lệ" required />
                </label>
              </div>
            </div>

            <button className="submit-button" type="submit" disabled={submitting}><span aria-hidden="true">➤</span> &nbsp;Gửi yêu cầu báo giá</button>
            <p className="form-note">Chúng tôi chỉ dùng số điện thoại để liên hệ tư vấn và báo giá.</p>
          </form>

          <aside className="booking-aside">
            <div className="aside-card">
              <h3>Quy trình làm việc</h3>
              <ol>
                <li>Gửi yêu cầu hoặc gọi hotline</li>
                <li>Tư vấn thiết bị phù hợp với sự kiện</li>
                <li>Nhận báo giá chi tiết, chốt lịch</li>
                <li>Lắp đặt &amp; vận hành tận nơi</li>
              </ol>
            </div>
            <div className="aside-card light">
              <h3>Cần tư vấn ngay?</h3>
              <div className="aside-actions">
                <a className="button button-primary" href="tel:0987654321">☎ Gọi 0987 654 321</a>
                <a className="button button-zalo" href="https://zalo.me/0987654321" target="_blank" rel="noopener">Nhắn Zalo</a>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
