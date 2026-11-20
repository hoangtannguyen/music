// Site content. Edit this file to update categories, combos, equipment and projects.
// NOTE: prices, combos, equipment and projects below are SAMPLE data - replace with real data.
// "image" is an Unsplash photo id (https://images.unsplash.com/photo-<id>).

export type CategoryKey = "wedding" | "birthday" | "gala" | "opening" | "conference" | "music";
export type EquipmentType = "speaker" | "mic" | "mixer" | "light" | "led" | "accessory";

export interface Combo {
  id: string;
  category: CategoryKey;
  name: string;
  guests: string;
  description: string;
  items: string[];
  price: string;
  image: string;
  badge?: string;
  featured?: boolean;
}

export interface Equipment {
  id: string;
  type: EquipmentType;
  name: string;
  spec: string;
  description: string;
}

export interface Project {
  category: CategoryKey;
  title: string;
  location: string;
  date: string;
  image: string;
}

export interface SiteData {
  categories: Record<CategoryKey, string>;
  equipmentTypes: Record<EquipmentType, string>;
  combos: Combo[];
  equipment: Equipment[];
  projects: Project[];
}

export const siteData: SiteData = {
  categories: {
    wedding: "Tiệc cưới",
    birthday: "Sinh nhật – Thôi nôi",
    gala: "Gala Dinner",
    opening: "Khai trương",
    conference: "Hội nghị",
    music: "Sự kiện âm nhạc"
  },

  equipmentTypes: {
    speaker: "Loa",
    mic: "Micro",
    mixer: "Mixer",
    light: "Đèn sân khấu",
    led: "Màn hình LED",
    accessory: "Phụ kiện"
  },

  combos: [
    {
      id: "wedding-basic",
      category: "wedding",
      name: "Combo Tiệc Cưới Cơ Bản",
      guests: "100 – 200 khách",
      description: "Đủ âm thanh, ánh sáng cho tiệc cưới tại gia hoặc nhà hàng quy mô vừa.",
      items: ["2 loa full 15\" + 1 loa sub 18\"", "2 micro không dây", "Mixer 12 kênh", "8 đèn LED par trang trí", "Kỹ thuật viên vận hành"],
      price: "Từ 3.500.000đ",
      image: "1464366400600-7168b8af9bc3",
      badge: "Phổ biến",
      featured: true
    },
    {
      id: "wedding-premium",
      category: "wedding",
      name: "Combo Tiệc Cưới Cao Cấp",
      guests: "300 – 500 khách",
      description: "Hệ thống line array, màn hình LED và hiệu ứng sân khấu cho tiệc cưới sang trọng.",
      items: ["Loa line array mini + 2 sub", "4 micro không dây", "Mixer digital 32 kênh", "Màn hình LED P3.9 (3 x 2m)", "Đèn moving head + khói lạnh"],
      price: "Từ 12.000.000đ",
      image: "1465495976277-4387d4b0b4c6",
      badge: "Cao cấp",
      featured: true
    },
    {
      id: "birthday",
      category: "birthday",
      name: "Combo Sinh Nhật – Thôi Nôi",
      guests: "Dưới 100 khách",
      description: "Gọn nhẹ, lắp đặt nhanh cho tiệc gia đình, sinh nhật và thôi nôi cho bé.",
      items: ["2 loa full 12\"", "2 micro không dây", "6 đèn LED trang trí", "Tivi 65\" trình chiếu ảnh"],
      price: "Từ 1.800.000đ",
      image: "1464349095431-e9a21285b5f3"
    },
    {
      id: "gala",
      category: "gala",
      name: "Combo Gala Dinner",
      guests: "200 – 400 khách",
      description: "Âm thanh hội trường, sân khấu LED và ánh sáng biểu diễn cho tiệc tất niên, gala.",
      items: ["Loa line array + monitor sân khấu", "4 micro không dây", "Màn hình LED P3.9 (4 x 2.5m)", "Đèn moving head, beam, follow", "Khung truss sân khấu"],
      price: "Từ 15.000.000đ",
      image: "1519167758481-83f550bb49b3",
      badge: "Trọn gói",
      featured: true
    },
    {
      id: "opening",
      category: "opening",
      name: "Combo Khai Trương",
      guests: "Ngoài trời / trong nhà",
      description: "Thu hút khách qua đường với âm thanh mạnh, hiệu ứng pháo giấy rộn ràng.",
      items: ["2 loa full 15\" + 1 loa sub 18\"", "2 micro không dây", "Bục phát biểu", "2 máy bắn pháo giấy"],
      price: "Từ 4.500.000đ",
      image: "1505236858219-8359eb29e329"
    },
    {
      id: "conference",
      category: "conference",
      name: "Combo Hội Nghị – Hội Thảo",
      guests: "50 – 300 khách",
      description: "Âm thanh rõ lời, trình chiếu sắc nét cho hội nghị, hội thảo, đào tạo.",
      items: ["4 loa hội trường", "6 micro cổ ngỗng + 2 micro không dây", "Mixer 12 kênh", "Màn hình LED P3.9 hoặc máy chiếu", "Kỹ thuật viên trực suốt chương trình"],
      price: "Từ 5.000.000đ",
      image: "1511578314322-379afb476865"
    },
    {
      id: "music",
      category: "music",
      name: "Combo Sự Kiện Âm Nhạc",
      guests: "500+ khán giả",
      description: "Hệ thống biểu diễn chuyên nghiệp cho đêm nhạc, liveshow, lễ hội ngoài trời.",
      items: ["Line array + 4 sub 18\"", "Monitor sân khấu cho nghệ sĩ", "Mixer digital 32 kênh", "Đèn beam, moving head, laser", "Khung truss + khói lạnh"],
      price: "Từ 25.000.000đ",
      image: "1514525253161-7a46d19cd819"
    }
  ],

  equipment: [
    { id: "speaker-full", type: "speaker", name: "Loa full đôi 15\"", spec: "1000W / cặp", description: "Âm thanh chính cho tiệc 100 – 300 khách." },
    { id: "speaker-sub", type: "speaker", name: "Loa sub 18\"", spec: "1200W", description: "Tăng dải trầm mạnh mẽ cho tiệc và sự kiện." },
    { id: "speaker-line-array", type: "speaker", name: "Loa line array", spec: "Bộ 4 – 8 thùng", description: "Phủ âm đều cho sân khấu lớn, ngoài trời." },
    { id: "speaker-monitor", type: "speaker", name: "Loa monitor sân khấu", spec: "12\" / 500W", description: "Giúp ca sĩ, MC nghe rõ trên sân khấu." },
    { id: "mic-wireless", type: "mic", name: "Micro không dây cầm tay", spec: "UHF, 2 micro / bộ", description: "Ổn định, chống hú cho MC và ca sĩ." },
    { id: "mic-headset", type: "mic", name: "Micro cài áo / đeo tai", spec: "UHF", description: "Rảnh tay cho diễn giả, MC, biểu diễn." },
    { id: "mic-gooseneck", type: "mic", name: "Micro cổ ngỗng hội nghị", spec: "Có chân để bàn", description: "Dành cho bàn chủ tọa, hội thảo." },
    { id: "mixer-analog", type: "mixer", name: "Mixer analog 12 kênh", spec: "Tích hợp effect", description: "Phù hợp tiệc cưới, hội nghị quy mô vừa." },
    { id: "mixer-digital", type: "mixer", name: "Mixer digital 32 kênh", spec: "Điều khiển qua tablet", description: "Cho sự kiện lớn, ban nhạc, liveshow." },
    { id: "light-par", type: "light", name: "Đèn LED par", spec: "18 x 10W RGBW", description: "Chiếu màu sân khấu, trang trí không gian." },
    { id: "light-moving", type: "light", name: "Đèn moving head beam", spec: "230W", description: "Tạo tia sáng chuyển động ấn tượng." },
    { id: "light-follow", type: "light", name: "Đèn follow", spec: "Bám nhân vật", description: "Làm nổi bật cô dâu chú rể, nghệ sĩ." },
    { id: "light-fog", type: "light", name: "Máy khói lạnh", spec: "Khói sát sàn", description: "Hiệu ứng mây bồng bềnh cho màn ra mắt." },
    { id: "led-indoor", type: "led", name: "Màn hình LED P3.9 trong nhà", spec: "Tính theo m²", description: "Hình ảnh sắc nét cho phông sân khấu." },
    { id: "led-outdoor", type: "led", name: "Màn hình LED P4.8 ngoài trời", spec: "Tính theo m²", description: "Độ sáng cao, chống nước cho sự kiện ngoài trời." },
    { id: "led-tv", type: "led", name: "Tivi 65\" kèm chân đứng", spec: "4K", description: "Trình chiếu ảnh cưới, slide hội thảo." },
    { id: "acc-truss", type: "accessory", name: "Khung truss sân khấu", spec: "Theo kích thước", description: "Khung treo đèn, loa và phông nền." },
    { id: "acc-confetti", type: "accessory", name: "Máy bắn pháo giấy", spec: "Điều khiển từ xa", description: "Khoảnh khắc cao trào cho khai trương, cưới." },
    { id: "acc-podium", type: "accessory", name: "Bục phát biểu", spec: "Mica / gỗ", description: "Cho phát biểu khai mạc, hội nghị." }
  ],

  projects: [
    { category: "wedding", title: "Tiệc cưới ngoài trời", location: "TP. Huế", date: "10/2026", image: "1519741497674-611481863552" },
    { category: "gala", title: "Gala Dinner tất niên doanh nghiệp", location: "TP. Huế", date: "01/2026", image: "1519167758481-83f550bb49b3" },
    { category: "music", title: "Đêm nhạc sinh viên", location: "TP. Huế", date: "04/2026", image: "1470229722913-7c0e2dbbafd3" },
    { category: "conference", title: "Hội thảo khách hàng", location: "TP. Huế", date: "08/2026", image: "1540575467063-178a50c2df87" },
    { category: "birthday", title: "Tiệc thôi nôi bé Na", location: "TP. Huế", date: "06/2026", image: "1530103862676-de8c9debad1d" },
    { category: "opening", title: "Khai trương cửa hàng", location: "Quảng Trị", date: "03/2026", image: "1505236858219-8359eb29e329" },
    { category: "wedding", title: "Tiệc cưới tại nhà hàng", location: "TP. Huế", date: "09/2026", image: "1464366400600-7168b8af9bc3" },
    { category: "music", title: "Lễ hội âm nhạc ngoài trời", location: "Đà Nẵng", date: "07/2026", image: "1459749411175-04bf5292ceea" },
    { category: "conference", title: "Hội nghị tổng kết năm", location: "TP. Huế", date: "12/2025", image: "1511578314322-379afb476865" },
    { category: "gala", title: "Gala kỷ niệm thành lập công ty", location: "Đà Nẵng", date: "05/2026", image: "1492684223066-81342ee5ff30" },
    { category: "birthday", title: "Tiệc sinh nhật gia đình", location: "TP. Huế", date: "02/2026", image: "1464349095431-e9a21285b5f3" },
    { category: "music", title: "Liveshow ca nhạc", location: "TP. Huế", date: "11/2026", image: "1501281668745-f7f57925c3b4" }
  ]
};
