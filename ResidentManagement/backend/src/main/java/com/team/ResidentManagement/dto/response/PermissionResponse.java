package com.team.ResidentManagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * DTO response mô tả thông tin của một quyền.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PermissionResponse {
    String name;
    String description;
}
