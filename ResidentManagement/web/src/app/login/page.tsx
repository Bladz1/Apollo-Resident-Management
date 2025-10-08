import { AuthTester, AuthTesterCopy } from '@/components/auth/AuthTester';

const LOGIN_COPY: AuthTesterCopy = {
  endpointPath: '/auth/login',
  card: {
    title: 'Đăng nhập hệ thống',
    description:
      'Trang đăng nhập được thiết kế theo phong cách tối giản giống GitHub nhưng được phối màu đồng nhất với chủ đề đỏ - vàng của landing page. Sử dụng biểu mẫu bên dưới để gửi yêu cầu tới API xác thực và kiểm tra phản hồi ngay lập tức.',
    usernameLabel: 'Tên đăng nhập',
    usernamePlaceholder: 'vd: admin',
    passwordLabel: 'Mật khẩu',
    passwordPlaceholder: '••••••••',
    rememberMeLabel: 'Ghi nhớ đăng nhập',
    forgotPasswordLabel: 'Quên mật khẩu?',
    forgotPasswordHref: '#',
    submitIdleLabel: 'Đăng nhập',
    submitLoadingLabel: 'Đang kiểm tra...',
    footerText: 'Chưa có tài khoản?',
    footerLinkLabel: 'Liên hệ quản trị để được cấp quyền',
    footerLinkHref: '#',
  },
  messages: {
    idle: 'Nhập thông tin và nhấn đăng nhập để bắt đầu kiểm tra.',
    success: 'Đăng nhập thành công! API đã phản hồi thành công.',
    errorTemplate: 'Đăng nhập thất bại (HTTP {status}). Vui lòng kiểm tra API.',
    network: 'Không thể kết nối tới API. Hãy kiểm tra lại server hoặc cấu hình URL.',
  },
  aside: {
    badgeLabel: 'Trạng thái API',
    heading: 'Theo dõi phản hồi ngay tức thì',
    endpointDescription: {
      before: 'Trang này sẽ gọi tới endpoint ',
      after: '. Hãy đảm bảo backend đang chạy và cho phép CORS từ domain của ứng dụng.',
    },
    statusTitle: 'Thông báo',
    responseTitle: 'Phản hồi từ API',
    defaultResponseText: 'Chưa có phản hồi.',
    tipsTitle: 'Mẹo kiểm thử nhanh',
    tips: [
      'Chỉnh NEXT_PUBLIC_API_BASE_URL trong file .env.local nếu API chạy ở địa chỉ khác.',
      'Quan sát phần "Phản hồi từ API" để xem JSON hoặc thông báo lỗi trả về.',
      'Sử dụng DevTools để kiểm tra request payload khi cần gỡ lỗi sâu hơn.',
    ],
  },
};

export default function LoginPage() {
  return <AuthTester copy={LOGIN_COPY} />;
}
