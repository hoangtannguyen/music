import { Link } from "react-router";

export default function FloatingContact() {
  return (
    <div className="floating-contact">
      <a className="float-btn float-zalo" href="https://zalo.me/0987654321" target="_blank" rel="noopener" aria-label="Nhắn Zalo 0987 654 321"><span className="float-icon" aria-hidden="true">Zalo</span><span className="float-text">Nhắn Zalo</span></a>
      <a className="float-btn float-call" href="tel:0987654321" aria-label="Gọi hotline 0987 654 321"><span className="float-icon" aria-hidden="true">☎</span><span className="float-text">Gọi ngay</span></a>
      <Link className="float-btn float-quote" to="/booking" aria-label="Nhận báo giá"><span className="float-icon" aria-hidden="true">✎</span><span className="float-text">Báo giá</span></Link>
    </div>
  );
}
