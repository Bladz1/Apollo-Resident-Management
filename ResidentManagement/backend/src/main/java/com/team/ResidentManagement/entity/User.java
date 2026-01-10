package com.team.ResidentManagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

/**
 * Thực thể người dùng lưu trữ thông tin cá nhân và liên kết vai trò, khoản phí.
 */
@Entity
@Getter @Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class User {

    /** Khoá chính dạng UUID do JPA sinh tự động. */
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    /**
     * Tên đăng nhập duy nhất, sử dụng collation UTF-8 để hỗ trợ tiếng Việt.
     */
    @Column(name = "username", unique = true, columnDefinition = "VARCHAR(255) COLLATE utf8mb4_unicode_ci")
    String username;

    String gender;

    /** Mật khẩu đã được mã hoá. */
    String password;

    /** Ngày sinh dùng để kiểm tra độ tuổi hợp lệ. */
    LocalDate birthday;

    String email;

    String address;

    String personalId;

    String phoneNumber;

    String avatarUrl;

    String status;

    /** Các vai trò của người dùng trong hệ thống. */
    @ManyToMany
    Set<Role> roles;

    /** Danh sách khoản phí cư dân phải đóng. */
    @ManyToMany
    Set<Fee> fees;
}
