package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.PermissionRequest;
import com.team.ResidentManagement.dto.response.PermissionResponse;
import com.team.ResidentManagement.entity.Permission;
import org.mapstruct.Mapper;

/**
 * Mapper chuyển đổi dữ liệu liên quan đến Permission.
 */
@Mapper(componentModel = "spring")
public interface PermissionMapper {

    Permission toPermission(PermissionRequest request);

    PermissionResponse toPermissionResponse(Permission permission);
}
