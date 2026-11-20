# Idempotent: bin/rails db:seed can be run repeatedly.
# - Admin account: created, or its password reset.
# - Event types / projects: created only when missing, so admin edits are never overwritten.

# Development falls back to the default account below; other environments must set
# ADMIN_EMAIL / ADMIN_PASSWORD so the default password never reaches production.
default_admin = Rails.env.development? ? { email: "admin@gmail.com", password: "123456789!aA" } : {}

email = ENV.fetch("ADMIN_EMAIL", default_admin[:email])
password = ENV.fetch("ADMIN_PASSWORD", default_admin[:password])
abort "Set ADMIN_EMAIL and ADMIN_PASSWORD to seed the admin account" if email.blank? || password.blank?

admin = Admin.find_or_initialize_by(email: email.strip.downcase)
admin.update!(password: password)
puts "Admin account ready: #{admin.email}"

# Sample content (photos from Unsplash, stored in db/seed_images)
def seed_image(record, photo_id)
  return if record.image.attached?

  record.image.attach(io: File.open(Rails.root.join("db/seed_images/#{photo_id}.jpg")), filename: "#{photo_id}.jpg", content_type: "image/jpeg")
end

event_types = [
  {
    key: "wedding", name: "Tiệc cưới", guests: "100 – 500 khách", image: "1519741497674-611481863552",
    summary: "Âm thanh ấm, ánh sáng lãng mạn cho ngày trọng đại.",
    description: "Đủ âm thanh, ánh sáng cho tiệc cưới tại gia hoặc nhà hàng, từ quy mô vừa đến tiệc cưới sang trọng.",
    items: [ "2 loa full 15\" + 1 loa sub 18\"", "2 micro không dây", "Mixer 12 kênh", "8 đèn LED par trang trí", "Kỹ thuật viên vận hành" ]
  },
  {
    key: "birthday", name: "Sinh nhật – Thôi nôi", guests: "Dưới 100 khách", image: "1530103862676-de8c9debad1d",
    summary: "Gọn nhẹ, vui tươi cho tiệc gia đình.",
    description: "Gọn nhẹ, lắp đặt nhanh cho tiệc gia đình, sinh nhật và thôi nôi cho bé.",
    items: [ "2 loa full 12\"", "2 micro không dây", "6 đèn LED trang trí", "Tivi 65\" trình chiếu ảnh" ]
  },
  {
    key: "gala", name: "Gala Dinner", guests: "200 – 400 khách", image: "1519167758481-83f550bb49b3",
    summary: "Sân khấu LED, ánh sáng biểu diễn đẳng cấp.",
    description: "Âm thanh hội trường, sân khấu LED và ánh sáng biểu diễn cho tiệc tất niên, gala.",
    items: [ "Loa line array + monitor sân khấu", "4 micro không dây", "Màn hình LED P3.9 (4 x 2.5m)", "Đèn moving head, beam, follow", "Khung truss sân khấu" ]
  },
  {
    key: "opening", name: "Khai trương", guests: "Ngoài trời / trong nhà", image: "1492684223066-81342ee5ff30",
    summary: "Âm thanh mạnh, pháo giấy rộn ràng thu hút khách.",
    description: "Thu hút khách qua đường với âm thanh mạnh, hiệu ứng pháo giấy rộn ràng.",
    items: [ "2 loa full 15\" + 1 loa sub 18\"", "2 micro không dây", "Bục phát biểu", "2 máy bắn pháo giấy" ]
  },
  {
    key: "conference", name: "Hội nghị", guests: "50 – 300 khách", image: "1540575467063-178a50c2df87",
    summary: "Âm thanh rõ lời, trình chiếu sắc nét.",
    description: "Âm thanh rõ lời, trình chiếu sắc nét cho hội nghị, hội thảo, đào tạo.",
    items: [ "4 loa hội trường", "6 micro cổ ngỗng + 2 micro không dây", "Mixer 12 kênh", "Màn hình LED P3.9 hoặc máy chiếu", "Kỹ thuật viên trực suốt chương trình" ]
  },
  {
    key: "music", name: "Sự kiện âm nhạc", guests: "500+ khán giả", image: "1470229722913-7c0e2dbbafd3",
    summary: "Hệ thống biểu diễn cho liveshow, lễ hội.",
    description: "Hệ thống biểu diễn chuyên nghiệp cho đêm nhạc, liveshow, lễ hội ngoài trời.",
    items: [ "Line array + 4 sub 18\"", "Monitor sân khấu cho nghệ sĩ", "Mixer digital 32 kênh", "Đèn beam, moving head, laser", "Khung truss + khói lạnh" ]
  }
]

event_types.each_with_index do |data, index|
  event_type = EventType.find_or_initialize_by(key: data[:key])
  next if event_type.persisted?

  event_type.assign_attributes(data.except(:key, :image).merge(items: data[:items].join("\n"), position: index + 1))
  seed_image(event_type, data[:image])
  event_type.save!
end
puts "Event types: #{EventType.count}"

projects = [
  { category: "wedding", title: "Tiệc cưới ngoài trời", location: "TP. Huế", date_label: "10/2026", image: "1519741497674-611481863552" },
  { category: "gala", title: "Gala Dinner tất niên doanh nghiệp", location: "TP. Huế", date_label: "01/2026", image: "1519167758481-83f550bb49b3" },
  { category: "music", title: "Đêm nhạc sinh viên", location: "TP. Huế", date_label: "04/2026", image: "1470229722913-7c0e2dbbafd3" },
  { category: "conference", title: "Hội thảo khách hàng", location: "TP. Huế", date_label: "08/2026", image: "1540575467063-178a50c2df87" },
  { category: "birthday", title: "Tiệc thôi nôi bé Na", location: "TP. Huế", date_label: "06/2026", image: "1530103862676-de8c9debad1d" },
  { category: "opening", title: "Khai trương cửa hàng", location: "Quảng Trị", date_label: "03/2026", image: "1505236858219-8359eb29e329" },
  { category: "wedding", title: "Tiệc cưới tại nhà hàng", location: "TP. Huế", date_label: "09/2026", image: "1464366400600-7168b8af9bc3" },
  { category: "music", title: "Lễ hội âm nhạc ngoài trời", location: "Đà Nẵng", date_label: "07/2026", image: "1459749411175-04bf5292ceea" },
  { category: "conference", title: "Hội nghị tổng kết năm", location: "TP. Huế", date_label: "12/2025", image: "1511578314322-379afb476865" },
  { category: "gala", title: "Gala kỷ niệm thành lập công ty", location: "Đà Nẵng", date_label: "05/2026", image: "1492684223066-81342ee5ff30" },
  { category: "birthday", title: "Tiệc sinh nhật gia đình", location: "TP. Huế", date_label: "02/2026", image: "1464349095431-e9a21285b5f3" },
  { category: "music", title: "Liveshow ca nhạc", location: "TP. Huế", date_label: "11/2026", image: "1501281668745-f7f57925c3b4" }
]

projects.each_with_index do |data, index|
  project = Project.find_or_initialize_by(title: data[:title])
  next if project.persisted?

  project.assign_attributes(data.slice(:location, :date_label).merge(event_type: EventType.find_by!(key: data[:category]), position: index + 1))
  seed_image(project, data[:image])
  project.save!
end
puts "Projects: #{Project.count}"

equipment = [
  { kind: "speaker", name: "Loa full đôi 15\"", spec: "1000W / cặp", description: "Âm thanh chính cho tiệc 100 – 300 khách." },
  { kind: "speaker", name: "Loa sub 18\"", spec: "1200W", description: "Tăng dải trầm mạnh mẽ cho tiệc và sự kiện." },
  { kind: "speaker", name: "Loa line array", spec: "Bộ 4 – 8 thùng", description: "Phủ âm đều cho sân khấu lớn, ngoài trời." },
  { kind: "speaker", name: "Loa monitor sân khấu", spec: "12\" / 500W", description: "Giúp ca sĩ, MC nghe rõ trên sân khấu." },
  { kind: "mic", name: "Micro không dây cầm tay", spec: "UHF, 2 micro / bộ", description: "Ổn định, chống hú cho MC và ca sĩ." },
  { kind: "mic", name: "Micro cài áo / đeo tai", spec: "UHF", description: "Rảnh tay cho diễn giả, MC, biểu diễn." },
  { kind: "mic", name: "Micro cổ ngỗng hội nghị", spec: "Có chân để bàn", description: "Dành cho bàn chủ tọa, hội thảo." },
  { kind: "mixer", name: "Mixer analog 12 kênh", spec: "Tích hợp effect", description: "Phù hợp tiệc cưới, hội nghị quy mô vừa." },
  { kind: "mixer", name: "Mixer digital 32 kênh", spec: "Điều khiển qua tablet", description: "Cho sự kiện lớn, ban nhạc, liveshow." },
  { kind: "light", name: "Đèn LED par", spec: "18 x 10W RGBW", description: "Chiếu màu sân khấu, trang trí không gian." },
  { kind: "light", name: "Đèn moving head beam", spec: "230W", description: "Tạo tia sáng chuyển động ấn tượng." },
  { kind: "light", name: "Đèn follow", spec: "Bám nhân vật", description: "Làm nổi bật cô dâu chú rể, nghệ sĩ." },
  { kind: "light", name: "Máy khói lạnh", spec: "Khói sát sàn", description: "Hiệu ứng mây bồng bềnh cho màn ra mắt." },
  { kind: "led", name: "Màn hình LED P3.9 trong nhà", spec: "Tính theo m²", description: "Hình ảnh sắc nét cho phông sân khấu." },
  { kind: "led", name: "Màn hình LED P4.8 ngoài trời", spec: "Tính theo m²", description: "Độ sáng cao, chống nước cho sự kiện ngoài trời." },
  { kind: "led", name: "Tivi 65\" kèm chân đứng", spec: "4K", description: "Trình chiếu ảnh cưới, slide hội thảo." },
  { kind: "accessory", name: "Khung truss sân khấu", spec: "Theo kích thước", description: "Khung treo đèn, loa và phông nền." },
  { kind: "accessory", name: "Máy bắn pháo giấy", spec: "Điều khiển từ xa", description: "Khoảnh khắc cao trào cho khai trương, cưới." },
  { kind: "accessory", name: "Bục phát biểu", spec: "Mica / gỗ", description: "Cho phát biểu khai mạc, hội nghị." }
]

equipment.each_with_index do |data, index|
  item = Equipment.find_or_initialize_by(name: data[:name])
  next if item.persisted?

  item.update!(data.merge(position: index + 1))
end
puts "Equipment: #{Equipment.count}"
