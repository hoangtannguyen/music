import type { Equipment, EquipmentCategory, EventType, Project } from "./contentApi";
import { API_BASE } from "./utils";

const STORAGE_KEY = "event-pro-admin-auth";

export type LeadStatus = "new" | "contacted" | "quoted" | "done" | "cancelled";

// Keep in sync with Lead::STATUSES (backend/app/models/lead.rb)
export const leadStatuses: Record<LeadStatus, string> = {
  new: "Mới",
  contacted: "Đã liên hệ",
  quoted: "Đã báo giá",
  done: "Hoàn tất",
  cancelled: "Đã hủy"
};

export interface Lead {
  id: number;
  service: string;
  event_date: string;
  guests: string;
  location: string;
  phone: string;
  name: string | null;
  equipment: string[];
  note: string | null;
  source: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface LeadPage {
  leads: Lead[];
  total: number;
  page: number;
  per_page: number;
  counts: Partial<Record<LeadStatus, number>>;
}

export class UnauthorizedError extends Error {}

// 422 from Rails: { errors: { field: ["message", ...] } }
export class ValidationError extends Error {
  constructor(public errors: Record<string, string[]>) {
    super("Validation failed");
  }
}

// Credentials live in sessionStorage only (cleared when the tab closes); storage may be unavailable
export function loadAuth(): string | null {
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export function saveAuth(username: string, password: string): string {
  const auth = "Basic " + btoa(String.fromCharCode(...new TextEncoder().encode(username + ":" + password)));
  try {
    window.sessionStorage.setItem(STORAGE_KEY, auth);
  } catch {
    // Keep working for this page view only
  }
  return auth;
}

export function clearAuth() {
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing stored
  }
}

async function request<T>(auth: string, path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(API_BASE + path, {
    ...init,
    headers: { Accept: "application/json", Authorization: auth, ...init.headers }
  });
  if (response.status === 401) throw new UnauthorizedError();
  if (response.status === 422) throw new ValidationError((await response.json()).errors ?? {});
  if (!response.ok) throw new Error("Admin API error: " + response.status);
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function fetchLeads(auth: string, status: string, page: number): Promise<LeadPage> {
  const query = new URLSearchParams({ page: String(page) });
  if (status !== "all") query.set("status", status);
  return request<LeadPage>(auth, "/admin/leads?" + query);
}

// Event types and projects: sent as multipart/form-data so an image file can be included
export function fetchAdminEventTypes(auth: string): Promise<EventType[]> {
  return request<EventType[]>(auth, "/admin/event_types");
}

export function saveEventType(auth: string, id: number | null, data: FormData): Promise<EventType> {
  return request<EventType>(auth, "/admin/event_types" + (id ? "/" + id : ""), { method: id ? "PATCH" : "POST", body: data });
}

export function deleteEventType(auth: string, id: number): Promise<void> {
  return request<void>(auth, "/admin/event_types/" + id, { method: "DELETE" });
}

export function fetchAdminProjects(auth: string): Promise<Project[]> {
  return request<Project[]>(auth, "/admin/projects");
}

export function saveProject(auth: string, id: number | null, data: FormData): Promise<Project> {
  return request<Project>(auth, "/admin/projects" + (id ? "/" + id : ""), { method: id ? "PATCH" : "POST", body: data });
}

export function deleteProject(auth: string, id: number): Promise<void> {
  return request<void>(auth, "/admin/projects/" + id, { method: "DELETE" });
}

export function fetchAdminEquipment(auth: string): Promise<Equipment[]> {
  return request<Equipment[]>(auth, "/admin/equipment");
}

export function saveEquipment(auth: string, id: number | null, data: FormData): Promise<Equipment> {
  return request<Equipment>(auth, "/admin/equipment" + (id ? "/" + id : ""), { method: id ? "PATCH" : "POST", body: data });
}

export function deleteEquipment(auth: string, id: number): Promise<void> {
  return request<void>(auth, "/admin/equipment/" + id, { method: "DELETE" });
}

export function fetchAdminEquipmentCategories(auth: string): Promise<EquipmentCategory[]> {
  return request<EquipmentCategory[]>(auth, "/admin/equipment_categories");
}

export function saveEquipmentCategory(auth: string, id: number | null, data: FormData): Promise<EquipmentCategory> {
  return request<EquipmentCategory>(auth, "/admin/equipment_categories" + (id ? "/" + id : ""), { method: id ? "PATCH" : "POST", body: data });
}

export function deleteEquipmentCategory(auth: string, id: number): Promise<void> {
  return request<void>(auth, "/admin/equipment_categories/" + id, { method: "DELETE" });
}

export function updateLeadStatus(auth: string, id: number, status: LeadStatus): Promise<Lead> {
  return request<Lead>(auth, "/admin/leads/" + id, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status })
  });
}
