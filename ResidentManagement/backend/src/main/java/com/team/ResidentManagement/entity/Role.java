package com.team.ResidentManagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

/**
 * Vai trò người dùng, liên kết tới danh sách quyền chi tiết.
 */
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Role {

    /** Tên vai trò dùng như khoá chính. */
    @Id
    String name;
    /** Mô tả ngắn gọn mục đích của vai trò. */
    String description;

    /** Danh sách quyền mà vai trò sở hữu. */
    @ManyToMany
    Set<Permission> permissions;
}
