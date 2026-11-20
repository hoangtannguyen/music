import type { ReactNode } from "react";

// Keep in sync with EquipmentCategory::ICONS (backend/app/models/equipment_category.rb)
export type EquipmentIconName = "speaker" | "mic" | "mixer" | "light" | "led" | "accessory";

export const equipmentIconLabels: Record<EquipmentIconName, string> = {
  speaker: "Loa",
  mic: "Micro",
  mixer: "Mixer",
  light: "Đèn",
  led: "Màn hình",
  accessory: "Khác"
};

const paths: Record<EquipmentIconName, ReactNode> = {
  speaker: <><rect x="5" y="2" width="14" height="20" rx="2" /><circle cx="12" cy="14" r="4" /><circle cx="12" cy="6.5" r="1.5" /></>,
  mic: <><rect x="9" y="2" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8" /></>,
  mixer: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M8 7v10M12 7v10M16 7v10" /><path d="M6.5 10h3M10.5 14h3M14.5 9h3" /></>,
  light: <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />,
  led: <><rect x="2" y="4" width="20" height="13" rx="1" /><path d="M8 21h8M12 17v4" /></>,
  accessory: <path d="M4 20 20 4M4 4l16 16M4 12h16M12 4v16" />
};

export default function EquipmentIcon({ icon, className }: { icon: EquipmentIconName | undefined; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[icon ?? "accessory"] ?? paths.accessory}
    </svg>
  );
}
