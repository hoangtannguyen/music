import type { EquipmentType } from "./data/siteData";
import { API_BASE } from "./utils";

// Content managed in the admin (backend/app/controllers/concerns/content_serialization.rb)
export interface Equipment {
  id: number;
  name: string;
  kind: EquipmentType;
  spec: string | null;
  description: string | null;
  position: number;
}

export interface EventType {
  id: number;
  key: string;
  name: string;
  summary: string | null;
  description: string | null;
  guests: string | null;
  items: string[];
  position: number;
  image_url: string | null;
}

export interface Project {
  id: number;
  title: string;
  category: string;
  event_type_id: number;
  location: string | null;
  date_label: string | null;
  position: number;
  image_url: string | null;
}

async function getJson<T>(path: string): Promise<T> {
  const response = await fetch(API_BASE + path, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Content API error: " + response.status);
  return response.json() as Promise<T>;
}

export function fetchEventTypes(): Promise<EventType[]> {
  return getJson<EventType[]>("/event_types");
}

export function fetchProjects(): Promise<Project[]> {
  return getJson<Project[]>("/projects");
}

export function fetchEquipment(): Promise<Equipment[]> {
  return getJson<Equipment[]>("/equipment");
}
