import { useEffect, useState } from "react";
import { equipmentTypes, type EquipmentType } from "../../data/siteData";
import { useSiteContent } from "../../SiteContent";
import FilterTabs from "../../components/FilterTabs";
import { fetchLeads, leadStatuses, updateLeadStatus, type LeadPage, type LeadStatus } from "../../adminApi";
import type { AdminPanelProps } from "./types";

// event_date is a plain YYYY-MM-DD date; format it without timezone conversion
const formatDate = (isoDate: string) => isoDate.split("-").reverse().join("/");
const dateTimeFormat = new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" });

export default function LeadsPanel({ auth, onToast, onError }: AdminPanelProps) {
  const { categoryName } = useSiteContent();
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<LeadPage | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchLeads(auth, filter, page)
      .then((result) => { if (!ignore) setData(result); })
      .catch((error) => { if (!ignore) onError(error); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [auth, filter, page, onError]);

  async function changeStatus(id: number, status: LeadStatus) {
    try {
      const updated = await updateLeadStatus(auth, id, status);
      setData((current) => current && {
        ...current,
        leads: current.leads.map((lead) => (lead.id === id ? updated : lead))
      });
      onToast("Đã cập nhật trạng thái #" + id + ": " + leadStatuses[status]);
    } catch (error) {
      onError(error);
    }
  }

  const tabs = Object.fromEntries(
    Object.entries(leadStatuses).map(([key, name]) => [key, name + " (" + (data?.counts[key as LeadStatus] ?? 0) + ")"])
  );
  const totalPages = data ? Math.max(1, Math.ceil(data.total / data.per_page)) : 1;

  return (
    <>
      <FilterTabs options={tabs} value={filter} onChange={(value) => { setFilter(value); setPage(1); }} label="Lọc theo trạng thái" />

      <div className="admin-table-wrap" aria-busy={loading}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Ngày gửi</th>
              <th>Khách hàng</th>
              <th>Sự kiện</th>
              <th>Địa điểm</th>
              <th>Thiết bị / Ghi chú</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {data?.leads.map((lead) => (
              <tr key={lead.id}>
                <td>{lead.id}</td>
                <td>
                  {dateTimeFormat.format(new Date(lead.created_at))}
                  <small>{lead.source === "booking-page" ? "Trang báo giá" : "Form trang chủ"}</small>
                </td>
                <td>
                  {lead.name || "—"}
                  <small><a href={"tel:" + lead.phone}>{lead.phone}</a></small>
                </td>
                <td>
                  {categoryName(lead.service)}
                  <small>{formatDate(lead.event_date)} · {lead.guests}</small>
                </td>
                <td>{lead.location}</td>
                <td className="admin-note">
                  {lead.equipment.length > 0 && <span>{lead.equipment.map((type) => equipmentTypes[type as EquipmentType] ?? type).join(", ")}</span>}
                  {lead.note && <small>{lead.note}</small>}
                  {lead.equipment.length === 0 && !lead.note && "—"}
                </td>
                <td>
                  <select
                    className={"input admin-status status-" + lead.status}
                    value={lead.status}
                    aria-label={"Trạng thái yêu cầu #" + lead.id}
                    onChange={(event) => changeStatus(lead.id, event.target.value as LeadStatus)}
                  >
                    {Object.entries(leadStatuses).map(([key, name]) => <option key={key} value={key}>{name}</option>)}
                  </select>
                </td>
              </tr>
            ))}
            {data && data.leads.length === 0 && (
              <tr><td colSpan={7} className="empty-note">Chưa có yêu cầu nào.</td></tr>
            )}
            {!data && (
              <tr><td colSpan={7} className="empty-note">Đang tải…</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-pager">
        <button className="button button-ghost button-sm" type="button" disabled={page <= 1} onClick={() => setPage(page - 1)}>← Trước</button>
        <span>Trang {page} / {totalPages} · {data?.total ?? 0} yêu cầu</span>
        <button className="button button-ghost button-sm" type="button" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Sau →</button>
      </div>
    </>
  );
}
