# Hướng dẫn nhanh dự án Resident Management

Tài liệu này giải thích cấu trúc và các thành phần quan trọng của dự án để người mới có thể nắm bắt nhanh.

## Tổng quan kiến trúc

Dự án gồm hai phần chính:

1. **`src/residentalManagement`** – Ứng dụng **Spring Boot** phục vụ API quản lý cư dân.
2. **`web`** – Ứng dụng **Next.js** (React) cho giao diện người dùng.

Mỗi phần có thể chạy độc lập, giao tiếp với nhau qua HTTP.

## Backend Spring Boot

### Điểm khởi động

| File | Vai trò |
| --- | --- |
| [`ResidentalManagementApplication.java`](src/residentalManagement/src/main/java/com/friends/residentalManagement/ResidentalManagementApplication.java) | Hàm `main` khởi động Spring Boot và tự động quét component. |

### Controller (lớp điều khiển)

| File | Mô tả |
| --- | --- |
| [`UserController`](src/residentalManagement/src/main/java/com/friends/residentalManagement/controller/UserController.java) | Định nghĩa API `/users` với 3 endpoint: lấy danh sách, lấy theo `id`, tạo mới. Sử dụng `UserService`. |

Các annotation quan trọng: `@RestController`, `@RequestMapping`, `@GetMapping`, `@PostMapping` – giúp ánh xạ HTTP request tới hàm Java.

### Service (lớp nghiệp vụ)

| File | Mô tả |
| --- | --- |
| [`UserService`](src/residentalManagement/src/main/java/com/friends/residentalManagement/service/UserService.java) | Chứa logic xử lý dữ liệu cư dân: gọi repository, chuyển đổi DTO bằng `UserMapper`. |
| [`AuthenticationService`](src/residentalManagement/src/main/java/com/friends/residentalManagement/service/AuthenticationService.java) | Đang để trống – chỗ dự kiến để thêm logic đăng nhập/xác thực. |

`@Service` đánh dấu lớp nghiệp vụ để Spring quản lý. Constructor được tạo nhờ Lombok `@AllArgsConstructor` + `@FieldDefaults` để tiêm phụ thuộc (`UserRepository`, `UserMapper`).

### DTO (Data Transfer Object)

| File | Vai trò |
| --- | --- |
| [`CreateUserRequest`](src/residentalManagement/src/main/java/com/friends/residentalManagement/dto/request/CreateUserRequest.java) | Dữ liệu request khi tạo người dùng, kèm ràng buộc validate (`@Pattern`, `@Size`). |
| [`UserResponse`](src/residentalManagement/src/main/java/com/friends/residentalManagement/dto/response/UserResponse.java) | Dữ liệu phản hồi trả về client. |
| [`ApiResponse`](src/residentalManagement/src/main/java/com/friends/residentalManagement/dto/response/ApiResponse.java) | Mẫu response chung, có `code`, `message`, `result`. |

Lombok (`@Data`, `@Builder`, ...) giúp giảm boilerplate (getter/setter, constructor).

### Entity & Repository

| File | Vai trò |
| --- | --- |
| [`User`](src/residentalManagement/src/main/java/com/friends/residentalManagement/entity/User.java) | Thực thể JPA ánh xạ bảng người dùng. Có trường UUID tự sinh. |
| [`UserRepository`](src/residentalManagement/src/main/java/com/friends/residentalManagement/repository/UserRepository.java) | Giao diện kế thừa `JpaRepository`, cung cấp CRUD và method tùy chỉnh `existsByUsername`, `findByUsername`. |

### Mapper

| File | Vai trò |
| --- | --- |
| [`UserMapper`](src/residentalManagement/src/main/java/com/friends/residentalManagement/mapper/UserMapper.java) | Interface MapStruct chuyển đổi giữa `CreateUserRequest` ⇄ `User` và `User` ⇄ `UserResponse`. | 

MapStruct sẽ tạo implementation tự động khi build (cần thêm dependency trong `pom.xml`).

### Cấu hình

| File | Vai trò |
| --- | --- |
| [`application.yaml`](src/residentalManagement/src/main/resources/application.yaml) | Port 8080, context-path `/resident-management`, cấu hình kết nối MySQL, `hibernate.ddl-auto=update`. |

> **Lưu ý:** cần khởi tạo database `resident_management` trước và chỉnh sửa `username/password` cho phù hợp.

## Frontend Next.js

### Layout & Page

| File | Vai trò |
| --- | --- |
| [`src/app/layout.tsx`](web/src/app/layout.tsx) | Định nghĩa layout gốc: import font, CSS, render `<Header />`, `<footer>`. |
| [`src/app/page.tsx`](web/src/app/page.tsx) | Trang chủ, hiện đang để nội dung trống. |

### Component tái sử dụng

| File | Vai trò |
| --- | --- |
| [`src/components/header.tsx`](web/src/components/header.tsx) | Header responsive với menu desktop, hamburger menu mobile, sử dụng state React. |

Layout sử dụng Tailwind CSS utility class (ví dụ `bg-red-900`, `flex`, `space-x-4`).

## Điều quan trọng cần biết

1. **Spring Boot + JPA**: hiểu Dependency Injection, `@RestController`, `@Service`, `@Entity`, `JpaRepository`.
2. **Lombok & MapStruct**: dự án phụ thuộc vào quá trình build để tạo code – cần cấu hình IDE để hỗ trợ annotation processing.
3. **Validation**: tạo user dùng `jakarta.validation` – cần bật `@Valid` trong controller nếu muốn kích hoạt.
4. **Cấu hình DB**: chạy được backend cần MySQL với cấu hình tương ứng.
5. **Frontend Next.js**: sử dụng App Router (`src/app`), component client (`'use client'`).

## Gợi ý học tiếp theo

- **Bổ sung phương thức**: cập nhật, xóa người dùng (RESTful CRUD đầy đủ).
- **Xác thực/Bảo mật**: triển khai `AuthenticationService`, tìm hiểu Spring Security, JWT.
- **Exception Handling**: viết `@ControllerAdvice` để trả lỗi chuẩn hóa.
- **MapStruct nâng cao**: custom mapping, mapping nested object.
- **Unit/Integration Test**: dùng JUnit + Spring Boot Test cho backend, React Testing Library cho frontend.
- **Frontend UI**: hoàn thiện trang chủ, kết nối API bằng `fetch`/`axios`, quản lý state (React Query/Redux).
- **Triển khai thực tế**: docker hóa, cấu hình profile (`application-dev.yaml`, `application-prod.yaml`).

Hy vọng tài liệu giúp bạn bắt đầu nhanh chóng!
