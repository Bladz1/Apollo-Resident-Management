export type Service = {
  id: string;
  name: string;
  description: string;
  features: string[];
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
  attachment: File | null;
};

export const notificationService: Service = {
  id: "thong-bao",
  name: "Thông báo",
  description:
    "Nhận thông tin kịp thời từ cơ quan quản lý về các thủ tục cư trú, giấy tờ và cập nhật dân cư.",
  features: [
    "Thông báo sắp hết hạn giấy tờ",
    "Thông tin bảo trì hệ thống",
    "Tin nhắn từ cán bộ phụ trách",
  ],
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
    id: "kien-nghi",
    name: "Kiến nghị & phản ánh",
    description:
      "Gửi phản ánh, kiến nghị trực tuyến và theo dõi tiến độ xử lý minh bạch, nhanh chóng.",
    features: ["Nộp kiến nghị trực tuyến", "Theo dõi trạng thái xử lý", "Nhận phản hồi chính thức"],
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
  attachment: null,
};
