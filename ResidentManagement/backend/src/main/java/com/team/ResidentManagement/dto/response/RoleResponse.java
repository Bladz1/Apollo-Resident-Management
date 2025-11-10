package com.team.ResidentManagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

/**
 * DTO response mô tả một vai trò và các quyền tương ứng.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RoleResponse {
    String name;
    String description;
    Set<PermissionResponse> permissions;
}
