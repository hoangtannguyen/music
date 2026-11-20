import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Project } from "../../contentApi";
import { useSiteContent } from "../../SiteContent";
import { deleteProject, fetchAdminProjects, saveProject, ValidationError } from "../../adminApi";
import ImageField from "./ImageField";
import { validationMessages, type AdminPanelProps } from "./types";

const LABELS: Record<string, string> = {
  title: "Tên dự án", event_type: "Loại sự kiện", location: "Địa điểm", date_label: "Thời gian",
  position: "Thứ tự", image: "Ảnh"
};

export default function ProjectsPanel({ auth, onToast, onError }: AdminPanelProps) {
  const { eventTypes, categoryName, reload: reloadSite } = useSiteContent();
  const [items, setItems] = useState<Project[] | null>(null);
  // null = list only, "new" = create form, Project = edit form
  const [editing, setEditing] = useState<Project | "new" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetchAdminProjects(auth).then(setItems).catch(onError);
  }, [auth, onError]);

  useEffect(load, [load]);

  function openForm(target: Project | "new") {
    setErrors([]);
    setEditing(target);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = editing === "new" ? null : editing;
    setSaving(true);
    try {
      const saved = await saveProject(auth, current?.id ?? null, new FormData(event.currentTarget));
      onToast((current ? "Đã cập nhật " : "Đã thêm ") + saved.title);
      setEditing(null);
      load();
      reloadSite();
    } catch (error) {
      if (error instanceof ValidationError) setErrors(validationMessages(error, LABELS));
      else onError(error);
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Project) {
    if (!window.confirm("Xóa dự án \"" + item.title + "\"?")) return;
    try {
      await deleteProject(auth, item.id);
      onToast("Đã xóa " + item.title);
      load();
      reloadSite();
    } catch (error) {
      onError(error);
    }
  }

  const current = editing === "new" ? null : editing;

  return (
    <>
      <div className="admin-toolbar">
        <h2>Dự án</h2>
        {!editing && <button className="button button-primary button-sm" type="button" onClick={() => openForm("new")}>+ Thêm dự án</button>}
      </div>

      {editing && (
        <form key={current?.id ?? "new"} className="booking-form admin-form" onSubmit={handleSubmit}>
          <h3>{current ? "Sửa: " + current.title : "Thêm dự án"}</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Tên dự án <span className="req">*</span></span>
              <input className="input" name="title" defaultValue={current?.title} maxLength={120} required />
            </label>
            <label className="form-group">
              <span className="form-label">Loại sự kiện <span className="req">*</span></span>
              <select className="input" name="event_type_id" defaultValue={current?.event_type_id ?? ""} required>
                <option value="" disabled>Chọn loại sự kiện</option>
                {eventTypes.map((eventType) => <option key={eventType.id} value={eventType.id}>{eventType.name}</option>)}
              </select>
            </label>
            <label className="form-group">
              <span className="form-label">Địa điểm</span>
              <input className="input" name="location" defaultValue={current?.location ?? ""} maxLength={120} placeholder="vd: TP. Huế" />
            </label>
            <label className="form-group">
              <span className="form-label">Thời gian</span>
              <input className="input" name="date_label" defaultValue={current?.date_label ?? ""} maxLength={20} placeholder="vd: 10/2026" />
            </label>
            <label className="form-group">
              <span className="form-label">Thứ tự hiển thị</span>
              <input className="input" type="number" name="position" min={0} defaultValue={current?.position ?? (items?.length ?? 0) + 1} />
            </label>
            <ImageField currentUrl={current?.image_url ?? null} required={!current} />
          </div>
          {errors.length > 0 && <ul className="admin-errors" role="alert">{errors.map((message) => <li key={message}>{message}</li>)}</ul>}
          <div className="admin-form-actions">
            <button className="button button-primary button-sm" type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu"}</button>
            <button className="button button-ghost button-sm" type="button" onClick={() => setEditing(null)}>Hủy</button>
          </div>
        </form>
      )}

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Ảnh</th><th>Tên dự án</th><th>Loại sự kiện</th><th>Địa điểm</th><th>Thời gian</th><th>Thứ tự</th><th></th></tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id}>
                <td>{item.image_url && <img className="admin-thumb" src={item.image_url} alt="" />}</td>
                <td>{item.title}</td>
                <td>{categoryName(item.category)}</td>
                <td>{item.location || "—"}</td>
                <td>{item.date_label || "—"}</td>
                <td>{item.position}</td>
                <td className="admin-row-actions">
                  <button className="button button-ghost button-sm" type="button" onClick={() => openForm(item)}>Sửa</button>
                  <button className="button button-ghost button-sm admin-danger" type="button" onClick={() => remove(item)}>Xóa</button>
                </td>
              </tr>
            ))}
            {items?.length === 0 && <tr><td colSpan={7} className="empty-note">Chưa có dự án nào.</td></tr>}
            {!items && <tr><td colSpan={7} className="empty-note">Đang tải…</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
