import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { EquipmentCategory } from "../../contentApi";
import { useSiteContent } from "../../SiteContent";
import EquipmentIcon, { equipmentIconLabels, type EquipmentIconName } from "../../components/EquipmentIcon";
import { deleteEquipmentCategory, fetchAdminEquipmentCategories, saveEquipmentCategory, ValidationError } from "../../adminApi";
import { validationMessages, type AdminPanelProps } from "./types";

const LABELS: Record<string, string> = { key: "Mã", name: "Tên nhóm", icon: "Icon", position: "Thứ tự", base: "Lỗi" };

export default function EquipmentCategoriesPanel({ auth, onToast, onError }: AdminPanelProps) {
  const { equipment, reload: reloadSite } = useSiteContent();
  const [items, setItems] = useState<EquipmentCategory[] | null>(null);
  // null = list only, "new" = create form, EquipmentCategory = edit form
  const [editing, setEditing] = useState<EquipmentCategory | "new" | null>(null);
  const [icon, setIcon] = useState<EquipmentIconName>("accessory");
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    fetchAdminEquipmentCategories(auth).then(setItems).catch(onError);
  }, [auth, onError]);

  useEffect(load, [load]);

  function openForm(target: EquipmentCategory | "new") {
    setErrors([]);
    setIcon(target === "new" ? "accessory" : target.icon);
    setEditing(target);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const current = editing === "new" ? null : editing;
    setSaving(true);
    try {
      const saved = await saveEquipmentCategory(auth, current?.id ?? null, new FormData(event.currentTarget));
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

  async function remove(item: EquipmentCategory) {
    if (!window.confirm("Xóa nhóm thiết bị \"" + item.name + "\"?")) return;
    try {
      await deleteEquipmentCategory(auth, item.id);
      onToast("Đã xóa " + item.name);
      load();
      reloadSite();
    } catch (error) {
      if (error instanceof ValidationError) onToast("Không xóa được: nhóm này vẫn còn thiết bị. Hãy chuyển hoặc xóa các thiết bị đó trước.");
      else onError(error);
    }
  }

  const current = editing === "new" ? null : editing;
  const countFor = (key: string) => equipment.filter((item) => item.kind === key).length;

  return (
    <>
      <div className="admin-toolbar">
        <h2>Nhóm thiết bị</h2>
        {!editing && <button className="button button-primary button-sm" type="button" onClick={() => openForm("new")}>+ Thêm nhóm</button>}
      </div>

      {editing && (
        <form key={current?.id ?? "new"} className="booking-form admin-form" onSubmit={handleSubmit}>
          <h3>{current ? "Sửa: " + current.name : "Thêm nhóm thiết bị"}</h3>
          <div className="form-grid">
            <label className="form-group">
              <span className="form-label">Tên nhóm <span className="req">*</span></span>
              <input className="input" name="name" defaultValue={current?.name} maxLength={80} required placeholder="vd: Khung sân khấu" />
            </label>
            <label className="form-group">
              <span className="form-label">Mã <span className="req">*</span></span>
              {current
                ? <input className="input" value={current.key} disabled />
                : <input className="input" name="key" pattern="[a-z0-9\-]+" maxLength={40} required placeholder="vd: truss" title="Chữ thường không dấu, số và dấu gạch ngang" />}
            </label>
            <div className="form-group full">
              <span className="form-label">Icon hiển thị trên trang Thiết bị</span>
              <div className="admin-icon-picker" role="radiogroup" aria-label="Icon">
                {(Object.keys(equipmentIconLabels) as EquipmentIconName[]).map((name) => (
                  <label key={name} className={"admin-icon-option" + (icon === name ? " selected" : "")}>
                    <input type="radio" name="icon" value={name} checked={icon === name} onChange={() => setIcon(name)} />
                    <EquipmentIcon icon={name} />
                    <span>{equipmentIconLabels[name]}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="form-group">
              <span className="form-label">Thứ tự hiển thị</span>
              <input className="input" type="number" name="position" min={0} defaultValue={current?.position ?? (items?.length ?? 0) + 1} />
            </label>
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
            <tr><th>Icon</th><th>Tên nhóm</th><th>Số thiết bị</th><th>Thứ tự</th><th></th></tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id}>
                <td><EquipmentIcon className="admin-icon-cell" icon={item.icon} /></td>
                <td>{item.name}<small>{item.key}</small></td>
                <td>{countFor(item.key)}</td>
                <td>{item.position}</td>
                <td className="admin-row-actions">
                  <button className="button button-ghost button-sm" type="button" onClick={() => openForm(item)}>Sửa</button>
                  <button className="button button-ghost button-sm admin-danger" type="button" onClick={() => remove(item)}>Xóa</button>
                </td>
              </tr>
            ))}
            {items?.length === 0 && <tr><td colSpan={5} className="empty-note">Chưa có nhóm thiết bị nào.</td></tr>}
            {!items && <tr><td colSpan={5} className="empty-note">Đang tải…</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
