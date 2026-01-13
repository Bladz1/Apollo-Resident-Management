export type Service = {
  id: string;
  name: string;
  description: string;
  features: string[];
};

export type WantedPerson = {
  id: string;
  name: string;
  alias?: string;
  crime: string;
  bounty?: string;
  lastSeen: string;
  imageUrl: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  summary: string;
  timestamp: string;
};

export type PetitionFormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  title: string;
  content: string;
  attachmentUrl: string | null;
};

export const services: Service[] = [
  {
    id: "nop-phi",
    name: "Thanh Toán",
    description:
      "Thanh toán trực tuyến các loại phí, lệ phí hành chính nhanh chóng, an toàn và tiện lợi.",
    features: ["Phí y tế  xã hội", "Phí hành chính công", "Phí giao thông"],
  },
  {
    id: "thong-bao",
    name: "Thông báo",
    description:
      "Nhận thông tin kịp thời từ cơ quan quản lý về các thủ tục cư trú, giấy tờ và cập nhật dân cư.",
    features: [
      "Thông báo sắp hết hạn giấy tờ",
      "Thông tin bảo trì hệ thống",
      "Tin nhắn từ cán bộ phụ trách",
    ],
  },
  {
    id: "kien-nghi",
    name: "Kiến nghị & phản ánh",
    description:
      "Gửi phản ánh, kiến nghị trực tuyến và theo dõi tiến độ xử lý minh bạch, nhanh chóng.",
    features: ["Nộp kiến nghị trực tuyến", "Theo dõi trạng thái xử lý", "Nhận phản hồi chính thức"],
  },
  {
    id: "truy-na",
    name: "Thông tin truy nã",
    description:
      "Cập nhật danh sách đối tượng truy nã, hỗ trợ người dân chủ động phối hợp đảm bảo an ninh.",
    features: [
      "Danh sách đối tượng mới cập nhật",
      "Kênh tiếp nhận thông tin ẩn danh",
      "Số điện thoại đường dây nóng",
    ],
  },
];

export const wantedPersons: WantedPerson[] = [
  {
    id: "wp-01",
    name: "Lò Văn Viên (SN 1986)",
    crime: "Công an tỉnh Thái Nguyên truy nã về tội sử dụng trái phép chất ma túy theo quyết định truy nã ngày 12/12/2025.",
    lastSeen: "xã Gia Hội, tỉnh Lào Cai",
    imageUrl: "/images/wanted/1.jpg",
  },
  {
    id: "wp-02",
    name: "Nguyễn Văn Mạnh  (SN 1982)",
    crime: "Công an thành phố Hà Nội đang xác minh đơn tố giác Nguyễn Văn Mạnh có hành vi lừa đảo chiếm đoạt tài sản.",
    lastSeen: " xã Nội Bài, TP Hà Nội",
    imageUrl: "/images/wanted/12.jpg",
  },
  {
    id: "wp-03",
    name: "Nguyễn Ngọc Tuấn (SN 1993)",
    crime: "TCông an thành phố Hà Nội đang xác minh đơn tố giác Nguyễn Văn Mạnh có hành vi lừa đảo chiếm đoạt tài sản.",
    lastSeen: "phường Sầm Sơn, tỉnh Thanh Hóa",
    imageUrl: "/images/wanted/21.jpg",
  },
];

export const notifications: NotificationItem[] = [
  {
    id: "noti-01",
    title: "Bảo trì hệ thống cư trú điện tử",
    summary:
      "Cổng thông tin sẽ bảo trì từ 22:00 đến 23:30 ngày 28/05/2025. Các dịch vụ tạm thời gián đoạn.",
    timestamp: "Cập nhật 26/05/2025",
  },
  {
    id: "noti-02",
    title: "Nhắc nhở gia hạn tạm trú",
    summary:
      "Các hồ sơ tạm trú hết hạn trong tháng 6 cần hoàn tất gia hạn trước ngày 15/06 để tránh gián đoạn cư trú.",
    timestamp: "Cập nhật 25/05/2025",
  },
  {
    id: "noti-03",
    title: "Phát hiện lừa đảo giả mạo cán bộ",
    summary: "Cảnh báo các cuộc gọi yêu cầu cung cấp mã OTP để chiếm đoạt tài khoản dịch vụ công.",
    timestamp: "Cập nhật 23/05/2025",
  },
];

export const initialPetitionState: PetitionFormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  title: "",
  content: "",
  attachmentUrl: null,
};
