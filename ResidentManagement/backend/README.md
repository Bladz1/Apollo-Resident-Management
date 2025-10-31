# Backend – Spring Boot

## Chạy ứng dụng

```bash
./mvnw spring-boot:run
```

Ứng dụng sẽ chạy ở `http://localhost:8080` với context mặc định (xem [`application.yaml`](src/main/resources/application.yaml)).

## Cấu trúc chính

- `configuration/` – cấu hình bảo mật JWT, seed dữ liệu ban đầu.
- `controller/` – REST controller cho xác thực, cư dân, vai trò, quyền, phí dịch vụ.
- `service/` – xử lý nghiệp vụ, gọi repository và mapper tương ứng.
- `repository/` – interface Spring Data JPA kết nối MySQL.
- `dto/` – request/response object và lớp `ApiResponse` chuẩn hóa phản hồi.
- `mapper/` – MapStruct mapper chuyển đổi giữa entity và DTO.
- `validator/` – custom constraint kiểm tra ngày sinh.

## Ghi chú

- Kiểm tra file `ddl_User.sql` khi cần tham khảo lược đồ ban đầu.
- Để chạy test: `./mvnw test`.
- Cấu hình MySQL (url, username, password) nằm trong `application.yaml`. Điều chỉnh cho phù hợp môi trường cục bộ.
