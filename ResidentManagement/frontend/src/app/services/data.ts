export type Service = {
  id: string;
  name: string;
  description: string;
  features: string[];
};

export type WantedPerson = {
  id: string;
  name: string;
  alias: string;
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
  captcha: string;
  attachment: File | null;
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
    name: "Nguyễn Văn Hùng",
    alias: "Hùng \"Đồng Nai\"",
    crime: "Liên quan đến vụ án cướp tài sản có vũ trang tại Đồng Nai (2024)",
    bounty: "Thưởng 200.000.000đ cho thông tin xác thực",
    lastSeen: "Xuất hiện lần cuối tại khu vực chợ đêm Đà Nẵng (04/2025)",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "wp-02",
    name: "Trần Thị Mỹ Dung",
    alias: "Dung \"Hoa Hồng\"",
    crime: "Cầm đầu đường dây lừa đảo tài chính xuyên quốc gia",
    bounty: "Thưởng 150.000.000đ cho thông tin giúp bắt giữ",
    lastSeen: "Nghi vấn di chuyển qua cửa khẩu Mộc Bài (03/2025)",
    imageUrl: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "wp-03",
    name: "Phạm Quốc Đạt",
    alias: "Đạt \"X\"",
    crime: "Tổ chức sản xuất ma túy tổng hợp với quy mô lớn",
    bounty: "Thưởng 300.000.000đ và bảo mật danh tính người cung cấp",
    lastSeen: "Phát hiện di chuyển tại tuyến cao tốc Hà Nội - Lào Cai (05/2025)",
    imageUrl: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=400&q=80",
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

export const PETITION_CAPTCHA = "8ZFQ";

export const initialPetitionState: PetitionFormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  title: "",
  content: "",
  captcha: "",
  attachment: null,
};
