import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { EventType } from "../../contentApi";
import { useSiteContent } from "../../SiteContent";
import { deleteEventType, fetchAdminEventTypes, saveEventType, ValidationError } from "../../adminApi";
import ImageField from "./ImageField";
import { validationMessages, type AdminPanelProps } from "./types";

const LABELS: Record<string, string> = {
  key: "Mã", name: "Tên", summary: "Mô tả ngắn", description: "Mô tả chi tiết", guests: "Quy mô",
  items: "Thiết bị gợi ý", position: "Thứ tự", image: "Ảnh", base: "Lỗi"
};

export default function EventTypesPanel({ auth, onToast, onError }: AdminPanelProps) {
  const { reload: reloadSite } = useSiteContent();
  const [items, setItems] = useState<EventType[] | null>(null);
  // null = list only, "new" = create form, EventType = edit form
  const [editing, setEditing] = useState<EventType | "new" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetchAdminEventTypes(auth).then(setItems).catch(onError);
  }, [auth, onError]);

  useEffect(load, [load]);

  function openForm(target: EventType | "new") {
    setErrors([]);
    setEditing(target);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = editing === "new" ? null : editing;
    setSaving(true);
    try {
      const saved = await saveEventType(auth, current?.id ?? null, new FormData(event.currentTarget));
      onToast((current ? "Đã cập nhật " : "Đã thêm ") + saved.name);
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

  async function remove(item: EventType) {
    if (!window.confirm("Xóa loại sự kiện \"" + item.name + "\"?")) return;
    try {
      await deleteEventType(auth, item.id);
      onToast("Đã xóa " + item.name);
      load();
      reloadSite();
    } catch (error) {
      if (error instanceof ValidationError) onToast("Không xóa được: loại sự kiện này vẫn còn dự án. Hãy đổi hoặc xóa các dự án đó trước.");
      else onError(error);
    }
  }

  const current = editing === "new" ? null : editing;

  return (
    <>
      <div className="admin-toolbar">
        <h2>Loại sự kiện</h2>
        {!editing && <button className="button button-primary button-sm" type="button" onClick={() => openForm("new")}>+ Thêm loại sự kiện</button>}
      </div>

      {editing && (
        <form key={current?.id ?? "new"} className="booking-form admin-form" onSubmit={handleSubmit}>
          <h3>{current ? "Sửa: " + current.name : "Thêm loại sự kiện"}</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Tên <span className="req">*</span></span>
              <input className="input" name="name" defaultValue={current?.name} maxLength={80} required />
            </label>
            <label className="form-group">
              <span className="form-label">Mã (dùng trong link) <span className="req">*</span></span>
              {current
                ? <input className="input" value={current.key} disabled />
                : <input className="input" name="key" pattern="[a-z0-9\-]+" maxLength={40} required placeholder="vd: tiec-tat-nien" title="Chữ thường không dấu, số và dấu gạch ngang" />}
            </label>
            <label className="form-group">
              <span className="form-label">Mô tả ngắn (thẻ trang chủ)</span>
              <input className="input" name="summary" defaultValue={current?.summary ?? ""} maxLength={160} />
            </label>
            <label className="form-group">
              <span className="form-label">Quy mô</span>
              <input className="input" name="guests" defaultValue={current?.guests ?? ""} maxLength={80} placeholder="vd: 100 – 300 khách" />
            </label>
            <label className="form-group full">
              <span className="form-label">Mô tả chi tiết (trang Dịch vụ)</span>
              <textarea className="input" name="description" defaultValue={current?.description ?? ""} maxLength={1000} />
            </label>
            <label className="form-group">
              <span className="form-label">Thiết bị gợi ý (mỗi dòng một mục)</span>
              <textarea className="input" name="items" defaultValue={current?.items.join("\n") ?? ""} />
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
            <tr><th>Ảnh</th><th>Tên</th><th>Mô tả ngắn</th><th>Quy mô</th><th>Thứ tự</th><th></th></tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id}>
                <td>{item.image_url && <img className="admin-thumb" src={item.image_url} alt="" />}</td>
                <td>{item.name}<small>{item.key}</small></td>
                <td>{item.summary || "—"}</td>
                <td>{item.guests || "—"}</td>
                <td>{item.position}</td>
                <td className="admin-row-actions">
                  <button className="button button-ghost button-sm" type="button" onClick={() => openForm(item)}>Sửa</button>
                  <button className="button button-ghost button-sm admin-danger" type="button" onClick={() => remove(item)}>Xóa</button>
                </td>
              </tr>
            ))}
            {items?.length === 0 && <tr><td colSpan={6} className="empty-note">Chưa có loại sự kiện nào.</td></tr>}
            {!items && <tr><td colSpan={6} className="empty-note">Đang tải…</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
