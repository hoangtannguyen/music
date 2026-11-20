import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, Route, Routes } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FloatingContact from "./components/FloatingContact";
import ScrollToTop from "./components/ScrollToTop";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import EquipmentPage from "./pages/EquipmentPage";
import ProjectsPage from "./pages/ProjectsPage";
import BookingPage from "./pages/BookingPage";
import AdminPage from "./pages/AdminPage";

function PublicLayout() {
  return (
    <>
      <div className="site-shell">
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
      <FloatingContact />
    </>
  );
}

export default function App() {
  const [toast, setToast] = useState({ message: "", show: false });
  const toastTimer = useRef<number>(undefined);

  // Stable identity: AdminPage uses it inside effect dependencies
  const showToast = useCallback((message: string) => {
    window.clearTimeout(toastTimer.current);
    setToast({ message, show: true });
    toastTimer.current = window.setTimeout(() => setToast((current) => ({ ...current, show: false })), 4500);
  }, []);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage onToast={showToast} />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/booking" element={<BookingPage onToast={showToast} />} />
          <Route path="*" element={<HomePage onToast={showToast} />} />
        </Route>
        <Route path="/admin" element={<AdminPage onToast={showToast} />} />
      </Routes>
      <div className={"toast" + (toast.show ? " show" : "")} role="status" aria-live="polite">{toast.message}</div>
    </>
  );
}
