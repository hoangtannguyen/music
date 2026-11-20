import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { clearAuth, loadAuth, saveAuth, UnauthorizedError } from "../adminApi";
import LeadsPanel from "./admin/LeadsPanel";
import EventTypesPanel from "./admin/EventTypesPanel";
import ProjectsPanel from "./admin/ProjectsPanel";
import EquipmentPanel from "./admin/EquipmentPanel";
import EquipmentCategoriesPanel from "./admin/EquipmentCategoriesPanel";

const SECTIONS = {
  leads: "Yêu cầu báo giá",
  eventTypes: "Loại sự kiện",
  projects: "Dự án",
  equipment: "Thiết bị",
  equipmentCategories: "Nhóm thiết bị"
} as const;

type Section = keyof typeof SECTIONS;

function LoginForm({ error, onLogin }: { error: string; onLogin: (username: string, password: string) => void }) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    onLogin(String(data.get("email")), String(data.get("password")));
  }

  return (
    <div className="admin-login">
      <form className="booking-form admin-login-card" onSubmit={handleSubmit}>
        <h1>Quản trị Event Pro</h1>
        <label className="form-group">
          <span className="form-label">Email</span>
          <input className="input" type="email" name="email" autoComplete="username" required />
        </label>
        <label className="form-group">
          <span className="form-label">Mật khẩu</span>
          <input className="input" type="password" name="password" autoComplete="current-password" required />
        </label>
        {error && <p className="admin-error" role="alert">{error}</p>}
        <button className="submit-button" type="submit">Đăng nhập</button>
        <p className="form-note"><Link to="/">← Về trang chủ</Link></p>
      </form>
    </div>
  );
}

export default function AdminPage({ onToast }: { onToast: (message: string) => void }) {
  const [auth, setAuth] = useState<string | null>(loadAuth);
  const [loginError, setLoginError] = useState("");
  const [section, setSection] = useState<Section>("leads");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const handleError = useCallback((error: unknown) => {
    if (error instanceof UnauthorizedError) {
      clearAuth();
      setAuth(null);
      setLoginError("Sai email hoặc mật khẩu.");
    } else {
      onToast("Không tải được dữ liệu. Kiểm tra backend đã chạy.");
    }
  }, [onToast]);

  function login(username: string, password: string) {
    setLoginError("");
    setAuth(saveAuth(username, password));
  }

  function logout() {
    clearAuth();
    setAuth(null);
  }

  if (!auth) return <LoginForm error={loginError} onLogin={login} />;

  const panelProps = { auth, onToast, onError: handleError };

  function selectSection(key: Section) {
    setSection(key);
    setMenuOpen(false);
  }

  return (
    <div className={menuOpen ? "admin menu-open" : "admin"}>
      <aside className="admin-sidebar" id="admin-sidebar">
        <div className="admin-sidebar-head">
          <div>
            <strong>Event Pro</strong>
            <span>Quản trị</span>
          </div>
          <button className="admin-icon-button admin-close" type="button" aria-label="Đóng menu" onClick={() => setMenuOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        <nav className="admin-nav" aria-label="Mục quản trị">
          {(Object.keys(SECTIONS) as Section[]).map((key) => (
            <button
              key={key}
              type="button"
              className={key === section ? "active" : undefined}
              aria-current={key === section ? "page" : undefined}
              onClick={() => selectSection(key)}
            >
              {SECTIONS[key]}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-foot">
          <Link to="/">Xem website</Link>
          <button className="button button-ghost button-sm" type="button" onClick={logout}>Đăng xuất</button>
        </div>
      </aside>
      <div className="admin-backdrop" aria-hidden="true" onClick={() => setMenuOpen(false)} />

      <div className="admin-content">
        <header className="admin-bar">
          <button
            className="admin-icon-button"
            type="button"
            aria-label="Mở menu"
            aria-controls="admin-sidebar"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <strong>{SECTIONS[section]}</strong>
        </header>

        <main className="admin-main">
          {section === "leads" && <LeadsPanel {...panelProps} />}
          {section === "eventTypes" && <EventTypesPanel {...panelProps} />}
          {section === "projects" && <ProjectsPanel {...panelProps} />}
          {section === "equipment" && <EquipmentPanel {...panelProps} />}
          {section === "equipmentCategories" && <EquipmentCategoriesPanel {...panelProps} />}
        </main>
      </div>
    </div>
  );
}
