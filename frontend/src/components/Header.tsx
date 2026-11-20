import { useState } from "react";
import Brand from "./Brand";

const navLinks = [
  { href: "index.html", label: "Trang chủ" },
  { href: "services.html", label: "Dịch vụ" },
  { href: "combos.html", label: "Combo" },
  { href: "equipment.html", label: "Thiết bị" },
  { href: "projects.html", label: "Dự án" },
  { href: "booking.html", label: "Báo giá" }
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="header">
      <Brand />
      <button className="menu-toggle" type="button" aria-label="Mở menu" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? "×" : "☰"}
      </button>
      <nav className={"nav" + (menuOpen ? " open" : "")} aria-label="Điều hướng chính">
        {navLinks.map((link, index) => (
          <a
            key={link.href}
            className={index === 0 ? "active" : undefined}
            href={link.href}
            aria-current={index === 0 ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="zalo-link" href="https://zalo.me/0987654321" target="_blank" rel="noopener" aria-label="Nhắn Zalo 0987 654 321">
          <span className="zalo-badge" aria-hidden="true">Zalo</span><span className="zalo-text">Chat Zalo</span>
        </a>
        <a className="phone-link" href="tel:0987654321" aria-label="Gọi 0987 654 321">
          <span aria-hidden="true">☎</span> 0987 654 321
        </a>
      </div>
    </header>
  );
}
