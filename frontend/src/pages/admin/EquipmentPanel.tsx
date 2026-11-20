import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Equipment } from "../../contentApi";
import { equipmentTypes } from "../../data/siteData";
import { useSiteContent } from "../../SiteContent";
import FilterTabs from "../../components/FilterTabs";
import { deleteEquipment, fetchAdminEquipment, saveEquipment, ValidationError } from "../../adminApi";
import { validationMessages, type AdminPanelProps } from "./types";

const LABELS: Record<string, string> = {
  name: "Tên thiết bị", kind: "Nhóm", spec: "Thông số", description: "Mô tả", position: "Thứ tự"
};

export default function EquipmentPanel({ auth, onToast, onError }: AdminPanelProps) {
  const { reload: reloadSite } = useSiteContent();
  const [items, setItems] = useState<Equipment[] | null>(null);
  const [filter, setFilter] = useState("all");
  // null = list only, "new" = create form, Equipment = edit form
  const [editing, setEditing] = useState<Equipment | "new" | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetchAdminEquipment(auth).then(setItems).catch(onError);
  }, [auth, onError]);

  useEffect(load, [load]);

  function openForm(target: Equipment | "new") {
    setErrors([]);
    setEditing(target);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = editing === "new" ? null : editing;
    setSaving(true);
    try {
      const saved = await saveEquipment(auth, current?.id ?? null, new FormData(event.currentTarget));
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

  async function remove(item: Equipment) {
    if (!window.confirm("Xóa thiết bị \"" + item.name + "\"?")) return;
    try {
      await deleteEquipment(auth, item.id);
      onToast("Đã xóa " + item.name);
      load();
      reloadSite();
    } catch (error) {
      onError(error);
    }
  }

  const current = editing === "new" ? null : editing;
  const visible = items?.filter((item) => filter === "all" || item.kind === filter);

  return (
    <>
      <div className="admin-toolbar">
        <h2>Thiết bị</h2>
        {!editing && <button className="button button-primary button-sm" type="button" onClick={() => openForm("new")}>+ Thêm thiết bị</button>}
      </div>

      {editing && (
        <form key={current?.id ?? "new"} className="booking-form admin-form" onSubmit={handleSubmit}>
          <h3>{current ? "Sửa: " + current.name : "Thêm thiết bị"}</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Tên thiết bị <span className="req">*</span></span>
              <input className="input" name="name" defaultValue={current?.name} maxLength={120} required />
            </label>
            <label className="form-group">
              <span className="form-label">Nhóm <span className="req">*</span></span>
              <select className="input" name="kind" defaultValue={current?.kind ?? (filter !== "all" ? filter : "")} required>
                <option value="" disabled>Chọn nhóm</option>
                {Object.entries(equipmentTypes).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
              </select>
            </label>
            <label className="form-group">
              <span className="form-label">Thông số</span>
              <input className="input" name="spec" defaultValue={current?.spec ?? ""} maxLength={80} placeholder={'vd: 1000W / cặp, 12" / 500W'} />
            </label>
            <label className="form-group">
              <span className="form-label">Thứ tự hiển thị</span>
              <input className="input" type="number" name="position" min={0} defaultValue={current?.position ?? (items?.length ?? 0) + 1} />
            </label>
            <label className="form-group full">
              <span className="form-label">Mô tả</span>
              <input className="input" name="description" defaultValue={current?.description ?? ""} maxLength={255} />
            </label>
          </div>
          {errors.length > 0 && <ul className="admin-errors" role="alert">{errors.map((message) => <li key={message}>{message}</li>)}</ul>}
          <div className="admin-form-actions">
            <button className="button button-primary button-sm" type="submit" disabled={saving}>{saving ? "Đang lưu…" : "Lưu"}</button>
            <button className="button button-ghost button-sm" type="button" onClick={() => setEditing(null)}>Hủy</button>
          </div>
        </form>
      )}

      <FilterTabs options={equipmentTypes} value={filter} onChange={setFilter} label="Lọc theo nhóm thiết bị" />

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Tên thiết bị</th><th>Nhóm</th><th>Thông số</th><th>Mô tả</th><th>Thứ tự</th><th></th></tr>
          </thead>
          <tbody>
            {visible?.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{equipmentTypes[item.kind] ?? item.kind}</td>
                <td>{item.spec || "—"}</td>
                <td>{item.description || "—"}</td>
                <td>{item.position}</td>
                <td className="admin-row-actions">
                  <button className="button button-ghost button-sm" type="button" onClick={() => openForm(item)}>Sửa</button>
                  <button className="button button-ghost button-sm admin-danger" type="button" onClick={() => remove(item)}>Xóa</button>
                </td>
              </tr>
            ))}
            {visible?.length === 0 && <tr><td colSpan={6} className="empty-note">Chưa có thiết bị nào.</td></tr>}
            {!visible && <tr><td colSpan={6} className="empty-note">Đang tải…</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
