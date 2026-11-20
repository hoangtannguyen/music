import { useEffect, useState } from "react";

const slides = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=2000&q=85",
  "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=85"
];

export default function Hero() {
  const [active, setActive] = useState(0);

  // Restarts the 6s timer whenever the slide changes (auto or by click)
  useEffect(() => {
    const timer = window.setTimeout(() => setActive((active + 1) % slides.length), 6000);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <section className="hero" aria-label="Cho thuê âm thanh ánh sáng sự kiện" style={{ backgroundImage: `url('${slides[active]}')` }}>
      <div className="hero-content">
        <p className="eyebrow">Cho thuê</p>
        <h1>Âm Thanh - Ánh Sáng<br />Tiệc Cưới &amp; Sự Kiện</h1>
        <p className="hero-description">Thiết bị chuẩn, kỹ thuật viên vận hành tận nơi, báo giá rõ ràng. Phục vụ tại Huế và các tỉnh lân cận.</p>
        <div className="hero-actions">
          <a className="button button-primary" href="booking.html">Nhận báo giá miễn phí <span aria-hidden="true">→</span></a>
          <a className="button button-outline" href="combos.html">Xem các gói combo</a>
        </div>
      </div>
      <div className="slider-dots" role="tablist" aria-label="Chọn ảnh trình chiếu">
        {slides.map((_, index) => (
          <button
            key={index}
            className={"slider-dot" + (index === active ? " active" : "")}
            type="button"
            role="tab"
            aria-label={"Ảnh " + (index + 1)}
            aria-selected={index === active}
            onClick={() => setActive(index)}
          />
        ))}
      </div>
    </section>
  );
}
