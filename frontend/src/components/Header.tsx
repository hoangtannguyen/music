import { useState } from "react";
import { NavLink } from "react-router";
import Brand from "./Brand";

const navLinks = [
  { to: "/", label: "Trang chủ" },
  { to: "/services", label: "Dịch vụ" },
  { to: "/equipment", label: "Thiết bị" },
  { to: "/projects", label: "Dự án" },
  { to: "/booking", label: "Báo giá" }
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
        {navLinks.map((link) => (
          <NavLink key={link.to} to={link.to} end onClick={() => setMenuOpen(false)}>
            {link.label}
          </NavLink>
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
