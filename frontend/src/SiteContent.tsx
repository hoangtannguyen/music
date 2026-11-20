import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { fetchEquipment, fetchEventTypes, fetchProjects, type Equipment, type EventType, type Project } from "./contentApi";

interface SiteContentValue {
  eventTypes: EventType[];
  projects: Project[];
  equipment: Equipment[];
  loading: boolean;
  failed: boolean;
  categoryName: (key: string) => string;
  reload: () => void;
}

const SiteContentContext = createContext<SiteContentValue | null>(null);

// Loads event types, projects and equipment once for the whole site; admin calls reload() after edits
export function SiteContentProvider({ children }: { children: ReactNode }) {
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    Promise.all([fetchEventTypes(), fetchProjects(), fetchEquipment()])
      .then(([types, items, equipmentItems]) => {
        if (ignore) return;
        setEventTypes(types);
        setProjects(items);
        setEquipment(equipmentItems);
        setFailed(false);
      })
      .catch(() => { if (!ignore) setFailed(true); })
      .finally(() => { if (!ignore) setLoading(false); });
    return () => { ignore = true; };
  }, [version]);

  const categoryName = useCallback(
    (key: string) => eventTypes.find((eventType) => eventType.key === key)?.name ?? key,
    [eventTypes]
  );
  const reload = useCallback(() => setVersion((current) => current + 1), []);

  return (
    <SiteContentContext.Provider value={{ eventTypes, projects, equipment, loading, failed, categoryName, reload }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContentValue {
  const value = useContext(SiteContentContext);
  if (!value) throw new Error("useSiteContent must be used inside SiteContentProvider");
  return value;
}
