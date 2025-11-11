import { NewsArticle } from "@/types/news";

export const sampleNewsArticles: NewsArticle[] = [
  {
    id: "featured-1",
    title: "Chính phủ ban hành nghị quyết mới về chuyển đổi số quốc gia",
    description:
      "Nghị quyết tập trung vào việc hoàn thiện hạ tầng dữ liệu quốc gia và tăng cường kết nối chia sẻ dữ liệu giữa các bộ, ngành.",
    link: "https://chinhphu.vn/chinh-phu-ban-hanh-nghi-quyet-ve-chuyen-doi-so-123456",
    pubDate: new Date().toISOString(),
    source: "Cổng thông tin Chính phủ",
    category: "tin-tuc-su-kien",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/01/hoi-nghi-chinh-phu.jpg",
  },
  {
    id: "policy-1",
    title: "Hướng dẫn triển khai cơ sở dữ liệu dân cư cấp tỉnh",
    description:
      "Bộ Công an ban hành hướng dẫn mới nhằm đảm bảo an toàn thông tin cho hệ thống dữ liệu dân cư địa phương.",
    link: "https://chinhphu.vn/huong-dan-trien-khai-co-so-du-lieu-dan-cu-987654",
    pubDate: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    source: "Báo Chính phủ",
    category: "chinh-sach-moi",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/02/du-lieu-dan-cu.jpg",
  },
  {
    id: "policy-2",
    title: "Cập nhật quy định xử lý hồ sơ cư trú trực tuyến",
    description:
      "Các địa phương được yêu cầu hoàn thành việc tích hợp chữ ký số vào quy trình xác thực hồ sơ cư trú trước quý II/2025.",
    link: "https://chinhphu.vn/cap-nhat-quy-dinh-xu-ly-ho-so-cu-tru-truc-tuyen-564738",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    source: "Cổng thông tin Chính phủ",
    category: "chinh-sach-moi",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/03/truc-tuyen.jpg",
  },
  {
    id: "diplomacy-1",
    title: "Tăng cường hợp tác dữ liệu với các tổ chức quốc tế",
    description:
      "Việt Nam ký kết biên bản ghi nhớ về chia sẻ dữ liệu dân cư với các tổ chức quốc tế nhằm đảm bảo an ninh thông tin.",
    link: "https://chinhphu.vn/tang-cuong-hop-tac-du-lieu-voi-to-chuc-quoc-te-135790",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    source: "Google News",
    category: "doi-ngoai",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/04/hop-tac-quoc-te.jpg",
  },
  {
    id: "event-1",
    title: "Triển khai trung tâm điều hành đô thị thông minh",
    description:
      "Nhiều tỉnh thành đưa vào vận hành trung tâm điều hành tích hợp dữ liệu dân cư, giao thông và an ninh công cộng.",
    link: "https://chinhphu.vn/trien-khai-trung-tam-dieu-hanh-do-thi-thong-minh-246810",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    source: "Cổng thông tin Chính phủ",
    category: "tin-tuc-su-kien",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/05/trung-tam-dieu-hanh.jpg",
  },
  {
    id: "digital-1",
    title: "Ra mắt tiện ích xác thực cư trú trên nền tảng di động",
    description:
      "Ứng dụng mới cho phép người dân xác nhận thông tin cư trú và nhận thông báo xử lý hồ sơ ngay trên điện thoại.",
    link: "https://chinhphu.vn/ra-mat-tien-ich-xac-thuc-cu-tru-tren-nen-tang-di-dong-112233",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    source: "Báo Chính phủ",
    category: "tin-tuc-su-kien",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/06/ung-dung-di-dong.jpg",
  },
  {
    id: "diplomacy-2",
    title: "Việt Nam tham dự diễn đàn dữ liệu mở khu vực",
    description:
      "Đoàn công tác trình bày kinh nghiệm xây dựng nền tảng dữ liệu dân cư và kế hoạch mở dữ liệu cho dịch vụ công.",
    link: "https://chinhphu.vn/viet-nam-tham-du-dien-dan-du-lieu-mo-khu-vuc-445566",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    source: "Google News",
    category: "doi-ngoai",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/07/dien-dan-du-lieu.jpg",
  },
  {
    id: "policy-3",
    title: "Ban hành tiêu chuẩn tích hợp dịch vụ công trực tuyến",
    description:
      "Các dịch vụ cư trú trực tuyến sẽ sử dụng chung nền tảng định danh điện tử, đảm bảo trải nghiệm đồng nhất cho người dân.",
    link: "https://chinhphu.vn/tieu-chuan-tich-hop-dich-vu-cong-truc-tuyen-778899",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 54).toISOString(),
    source: "Cổng thông tin Chính phủ",
    category: "chinh-sach-moi",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/08/dich-vu-cong.jpg",
  },
  {
    id: "event-2",
    title: "Khai trương trung tâm hỗ trợ cư dân trực tuyến",
    description:
      "Trung tâm cung cấp dịch vụ tư vấn và hỗ trợ xử lý hồ sơ cư trú trực tuyến 24/7 qua nhiều kênh khác nhau.",
    link: "https://chinhphu.vn/khai-truong-trung-tam-ho-tro-cu-dan-truc-tuyen-991122",
    pubDate: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    source: "Báo Chính phủ",
    category: "tin-tuc-su-kien",
    image:
      "https://media.chinhphu.vn/Images/Upload/2025/01/09/trung-tam-ho-tro.jpg",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  all: "Tất cả",
  "tin-tuc-su-kien": "Tin tức",
  "chinh-sach-moi": "Chính sách",
  "doi-ngoai": "Đối ngoại",
};

export type CategoryKey = keyof typeof CATEGORY_LABELS;
