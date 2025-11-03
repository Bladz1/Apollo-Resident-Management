# Hướng dẫn cho người mới: Dự án Resident Management

Tài liệu này giúp bạn làm quen và khởi chạy nhanh ứng dụng **Resident Management** – hệ thống quản lý cư dân gồm backend Spring Boot và frontend Next.js.

## 1. Tổng quan dự án
- **Backend (`ResidentManagement/backend/`)**: REST API xây dựng bằng Spring Boot, dùng Spring Security để xác thực bằng JWT và Spring Data JPA để giao tiếp MySQL.
- **Frontend (`ResidentManagement/frontend/`)**: Ứng dụng Next.js (TypeScript) sử dụng Tailwind CSS để cung cấp giao diện cho cư dân và ban quản trị.
- **Cơ sở dữ liệu**: MySQL.

Sơ đồ luồng đơn giản:
1. Người dùng truy cập giao diện Next.js.
2. Frontend gọi REST API của backend.
3. Backend xử lý nghiệp vụ, truy cập MySQL và trả kết quả cho frontend.

## 2. Yêu cầu hệ thống
| Thành phần | Phiên bản khuyến nghị |
| ---------- | --------------------- |
| Node.js    | >= 18 LTS             |
| npm        | đi kèm Node.js        |
| Java       | 17 hoặc mới hơn       |
| Maven      | Đi kèm `./mvnw` nên không cần cài riêng |
| MySQL      | 8.x                   |
| Docker     | Tuỳ chọn (nếu muốn container hoá) |

> 💡 Bạn có thể dùng MySQL cài sẵn, Docker hoặc dịch vụ cloud. Chỉ cần cập nhật thông tin kết nối trong `backend/src/main/resources/application.yaml`.

## 3. Chuẩn bị mã nguồn
```bash
# Clone repository
git clone <repository-url>
cd name

# Cấu trúc chính
ResidentManagement/
  backend/
  frontend/
```

## 4. Thiết lập backend (Spring Boot)
1. Chuyển sang thư mục backend:
   ```bash
   cd ResidentManagement/backend
   ```
2. Sao chép file cấu hình mẫu nếu có (ví dụ `application.yaml` ➝ `application-local.yaml`) và cập nhật thông tin:
   - `spring.datasource.url`: URL kết nối MySQL.
   - `spring.datasource.username` / `password`.
   - Bí mật JWT nếu có cấu hình.
3. Khởi động dịch vụ:
   ```bash
   ./mvnw spring-boot:run
   ```
4. API sẽ chạy ở `http://localhost:8080`.
5. Chạy test (tuỳ chọn):
   ```bash
   ./mvnw test
   ```

## 5. Thiết lập frontend (Next.js)
1. Mở terminal mới và chuyển tới thư mục frontend:
   ```bash
   cd ResidentManagement/frontend
   ```
2. Cài phụ thuộc:
   ```bash
   npm install
   ```
3. (Tuỳ chọn) tạo file `.env.local` để cấu hình URL backend:
   ```env
   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
   ```
4. Chạy ứng dụng:
   ```bash
   npm run dev
   ```
5. Giao diện sẽ có tại `http://localhost:3000`.

## 6. Các thư mục quan trọng
| Đường dẫn | Mô tả |
| --------- | ----- |
| `backend/src/main/java/com/team/ResidentManagement/controller/` | Các REST controller (User, Fee, Auth...). |
| `backend/src/main/java/com/team/ResidentManagement/service/`    | Lớp nghiệp vụ tương tác repository. |
| `backend/src/main/java/com/team/ResidentManagement/dto/`        | Định nghĩa DTO request/response và `ApiResponse`. |
| `backend/src/main/java/com/team/ResidentManagement/configuration/` | Cấu hình Spring Security, JWT, dữ liệu khởi tạo. |
| `frontend/src/app/`                                             | Router chính của Next.js. |
| `frontend/src/components/`                                      | Component tái sử dụng (header, auth UI...). |

## 7. Quy trình phát triển gợi ý
1. Tạo nhánh mới cho tính năng/bugfix.
2. Làm việc trong thư mục `backend/` hoặc `frontend/` tương ứng.
3. Viết hoặc cập nhật test (Spring Boot test, React test nếu có).
4. Đảm bảo `./mvnw test` và `npm run lint`/`npm run test` (nếu được cấu hình) chạy thành công.
5. Commit và mở Pull Request.

## 8. Tài liệu thêm
- [README backend & frontend chi tiết](ResidentManagement/README.md).
- Tài liệu Spring Boot: <https://spring.io/projects/spring-boot>
- Tài liệu Next.js: <https://nextjs.org/docs>
- Hướng dẫn MySQL: <https://dev.mysql.com/doc/>

> Nếu có thêm câu hỏi, hãy liên hệ đội dự án hoặc mở issue trên repository.
