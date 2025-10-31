# Resident Management

Ứng dụng quản lý cư dân gồm hai phần riêng biệt:

- **`backend/`** – dịch vụ Spring Boot cung cấp REST API, quản lý bảo mật và truy cập cơ sở dữ liệu MySQL.
- **`frontend/`** – ứng dụng Next.js (TypeScript) hiển thị giao diện cho cư dân và ban quản trị.

Mỗi phần có thể khởi động độc lập và giao tiếp với nhau qua HTTP.

## Bố cục thư mục

```
backend/
  src/main/java/com/team/ResidentManagement/
    controller/     // Lớp điều khiển REST cho user, role, permission, fee, auth
    service/        // Xử lý nghiệp vụ và tương tác repository
    repository/     // JPA repository thao tác với MySQL
    dto/            // DTO request/response, ApiResponse chung
    configuration/  // Cấu hình bảo mật JWT, khởi tạo dữ liệu
    ...
frontend/
  src/app/          // App Router của Next.js
  src/components/   // Thành phần tái sử dụng (header, auth, UI helpers)
```

Một số tệp quan trọng:

| Vị trí | Vai trò |
| --- | --- |
| [`ResidentManagementApplication`](backend/src/main/java/com/team/ResidentManagement/ResidentManagementApplication.java) | Điểm khởi động Spring Boot. |
| [`SecurityConfig`](backend/src/main/java/com/team/ResidentManagement/configuration/SecurityConfig.java) | Cấu hình Spring Security & JWT. |
| [`UserController`](backend/src/main/java/com/team/ResidentManagement/controller/UserController.java) | CRUD cư dân và endpoint thông tin người dùng hiện tại. |
| [`ApiResponse`](backend/src/main/java/com/team/ResidentManagement/dto/response/ApiResponse.java) | Mẫu phản hồi chuẩn hoá cho REST API. |
| [`frontend/src/app/page.tsx`](frontend/src/app/page.tsx) | Trang chủ Next.js. |
| [`frontend/src/components/header/header.tsx`](frontend/src/components/header/header.tsx) | Header responsive và menu điều hướng. |

## Hướng dẫn nhanh

### Backend (Spring Boot)

```bash
cd backend
./mvnw spring-boot:run
```

Mặc định ứng dụng chạy ở `http://localhost:8080`. Cập nhật thông tin kết nối MySQL trong [`application.yaml`](backend/src/main/resources/application.yaml) trước khi chạy.

Chạy test:

```bash
./mvnw test
```

### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Ứng dụng phục vụ tại `http://localhost:3000`.

## Gợi ý mở rộng

- Thêm Docker Compose để khởi chạy cả backend và frontend cùng MySQL.
- Viết tài liệu API và thử nghiệm bằng Postman/Insomnia.
- Bổ sung test tự động cho component React và service Spring Boot.
