package com.team.ResidentManagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * Quyền thao tác cụ thể được gán cho vai trò.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Permission {

    /** Tên quyền duy nhất, làm khoá chính. */
    @Id
    String name;

    /** Mô tả chi tiết chức năng của quyền. */
    String description;
}
