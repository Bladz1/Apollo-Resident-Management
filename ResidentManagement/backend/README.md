# Backend – Spring Boot (Hướng OOP)

Backend được thiết kế theo hướng **OOP + Layered Architecture**, tách rõ mô hình dữ liệu, nghiệp vụ và giao tiếp API. Mỗi tầng là một tập hợp **class** có trách nhiệm riêng, tương tác qua interface/DTO/mapper để giảm phụ thuộc và dễ mở rộng.

## 1) Khởi chạy nhanh

```bash
./mvnw spring-boot:run
```

Ứng dụng chạy tại `http://localhost:8080`. Cấu hình kết nối MySQL trong `src/main/resources/application.yaml`.

Chạy test:

```bash
./mvnw test
```

## 2) Kiến trúc OOP tổng quan

Luồng xử lý điển hình: **Controller → Service → Repository → Entity**, dữ liệu trả về được ánh xạ qua **DTO + Mapper**.

```
Controller (REST API)
   ↓
Service (nghiệp vụ)
   ↓
Repository (JPA)
   ↓
Entity (domain model)
   ↑
DTO + Mapper (đóng gói/biến đổi dữ liệu)
```

### 2.1 Domain Model (Entity)
Các lớp trong `entity/` biểu diễn nghiệp vụ cốt lõi (OOP domain objects):
- `User`, `Role`, `Permission` – tài khoản và phân quyền.
- `Profile`, `ProfileHistory`, `ProfileAttachment` – hồ sơ cư dân và lịch sử thay đổi.
- `Fee` – khoản phí.
- `Wanted` – đối tượng truy nã.
- `InvalidatedToken` – token đã bị thu hồi.

Entity là trung tâm của mô hình OOP: mô tả dữ liệu + quan hệ (JPA annotations).

### 2.2 Repository (Data Access Layer)
Các interface trong `repository/` kế thừa Spring Data JPA, ví dụ:
- `UserRepository`, `RoleRepository`, `PermissionRepository`
- `FeeRepository`, `ProfileRepository`, `WantedRepository`

Repository đóng vai trò **gateway** tới DB, giúp service thao tác entity bằng OOP thay vì SQL thuần.

### 2.3 Service (Business Layer)
Các class trong `service/` hiện thực nghiệp vụ:
- `AuthenticationService`, `UserService`, `RoleService`, `PermissionService`
- `ProfileService`, `FeeService`, `WantedService`
- `FileStorageService`, `ProfileImageUploadService`, `OnlineService`

Service là nơi tập trung logic, kiểm tra ràng buộc, gọi repository và mapper.

### 2.4 Controller (API Layer)
`controller/` cung cấp REST API và điều phối request/response:
- `AuthenticationController`, `UserController`, `RoleController`, `PermissionController`
- `ProfileController`, `FeeController`, `WantedController`, `OnlineController`
- `FileController`

Controller giữ vai trò **orchestrator**, không chứa logic phức tạp (được đẩy xuống service).

### 2.5 DTO + Mapper (Object Transformation)
- `dto/request` & `dto/response` định nghĩa dữ liệu vào/ra.
- `Mapper/` (MapStruct) chuyển đổi giữa DTO và Entity.

Điều này giúp **tách model nội bộ** khỏi model API, thuận tiện thay đổi và bảo trì.

### 2.6 Validation, Exception & Enums
- `validator/` gồm `BirthdayValidator` và `BirthdayConstraint` cho kiểm tra dữ liệu đầu vào.
- `exception/` gồm `AppException`, `ErrorCode`, `GlobalExceptionHandler` để chuẩn hoá lỗi.
- `enums/` chứa `ProfileAction`, `ProfileType`, `ProfileStatus`, `Bill`, `Role` (enum nội bộ).

### 2.7 Security & Configuration
`configuration/` bao gồm:
- `SecurityConfig`, `JwtAuthenticationEntryPoint`, `CustomJwtDecoder` – cấu hình Spring Security + JWT.
- `ApplicationInitConfig` – khởi tạo dữ liệu ban đầu.
- `WebConfig`, `RedisConfig` – cấu hình web/redis.

## 3) Các mẫu OOP nổi bật

### Strategy Pattern: FeePolicy
`FeePolicy` là interface chiến lược tính phí. Các implement cụ thể:
- `FlatFeePolicy`
- `ParkingFeePolicy`
- `WaterUsageFeePolicy`

Bạn có thể thêm chính sách mới bằng cách tạo class implement `FeePolicy` mà không sửa logic cũ (Open/Closed Principle).

### DTO + Mapper Pattern
Tách entity khỏi API contract để **bảo vệ domain model** và dễ refactor.

### Layered Architecture
Mỗi layer có trách nhiệm riêng → code rõ ràng, dễ test và dễ mở rộng.

## 4) Cách mở rộng theo hướng OOP

Ví dụ thêm một nghiệp vụ mới (Entity + API mới):
1. Tạo entity mới trong `entity/`.
2. Tạo repository tương ứng trong `repository/`.
3. Tạo DTO request/response trong `dto/`.
4. Thêm mapper trong `Mapper/`.
5. Viết service xử lý nghiệp vụ trong `service/`.
6. Tạo controller để expose API.

## 5) Ghi chú

- Xem `ddl_User.sql` nếu cần tham khảo lược đồ DB ban đầu.
- Các class quan trọng:
  - `ResidentManagementApplication` – điểm khởi động Spring Boot.
  - `SecurityConfig` – cấu hình bảo mật.
  - `ApiResponse` – chuẩn hoá response API.

---

> README này mô tả backend theo hướng OOP để giúp dễ hiểu cấu trúc và mở rộng hệ thống.
