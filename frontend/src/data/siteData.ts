// Static site content: equipment groups and guest ranges.
// Event types, projects and equipment are managed in the admin and loaded from the API (see contentApi.ts).

export type EquipmentType = "speaker" | "mic" | "mixer" | "light" | "led" | "accessory";

// Keep in sync with Equipment::KINDS (backend/app/models/equipment.rb); each group has an icon on the equipment page
export const equipmentTypes: Record<EquipmentType, string> = {
  speaker: "Loa",
  mic: "Micro",
  mixer: "Mixer",
  light: "Đèn sân khấu",
  led: "Màn hình LED",
  accessory: "Phụ kiện"
};

// Keep in sync with Lead::GUEST_RANGES (backend/app/models/lead.rb)
export const guestRanges = ["Dưới 100 khách", "100 - 300 khách", "300 - 500 khách", "Trên 500 khách"];
