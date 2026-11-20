import { useCallback, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { clearAuth, loadAuth, saveAuth, UnauthorizedError } from "../adminApi";
import LeadsPanel from "./admin/LeadsPanel";
import EventTypesPanel from "./admin/EventTypesPanel";
import ProjectsPanel from "./admin/ProjectsPanel";
import EquipmentPanel from "./admin/EquipmentPanel";

const SECTIONS = {
  leads: "Yêu cầu báo giá",
  eventTypes: "Loại sự kiện",
  projects: "Dự án",
  equipment: "Thiết bị"
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

  return (
    <div className="admin">
      <header className="admin-bar">
        <strong>Event Pro · Quản trị</strong>
        <nav className="admin-nav" aria-label="Mục quản trị">
          {(Object.keys(SECTIONS) as Section[]).map((key) => (
            <button
              key={key}
              type="button"
              className={key === section ? "active" : undefined}
              aria-current={key === section ? "page" : undefined}
              onClick={() => setSection(key)}
            >
              {SECTIONS[key]}
            </button>
          ))}
        </nav>
        <div className="admin-bar-actions">
          <Link to="/">Xem website</Link>
          <button className="button button-ghost button-sm" type="button" onClick={logout}>Đăng xuất</button>
        </div>
      </header>

      <main className="admin-main">
        {section === "leads" && <LeadsPanel {...panelProps} />}
        {section === "eventTypes" && <EventTypesPanel {...panelProps} />}
        {section === "projects" && <ProjectsPanel {...panelProps} />}
        {section === "equipment" && <EquipmentPanel {...panelProps} />}
      </main>
    </div>
  );
}
