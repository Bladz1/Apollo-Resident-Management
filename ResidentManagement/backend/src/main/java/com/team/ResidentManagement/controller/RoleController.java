package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.request.RoleRequest;
import com.team.ResidentManagement.dto.response.RoleResponse;
import com.team.ResidentManagement.service.PermissionService;
import com.team.ResidentManagement.service.RoleService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller thao tác với vai trò và quyền liên quan.
 */
@RestController
@RequestMapping("/roles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleController {

    /** Service quyền (nếu cần mở rộng). */
    PermissionService permissionService;
    /** Service vai trò. */
    RoleService roleService;

    /** Tạo mới vai trò kèm quyền. */
    @PostMapping
    ApiResponse<RoleResponse> createRole(@RequestBody RoleRequest request){
        return ApiResponse.<RoleResponse>builder()
                .result(roleService.createRole(request))
                .build();
    }

    /** Lấy toàn bộ danh sách vai trò. */
    @GetMapping
    ApiResponse<List<RoleResponse>> getRoles(){
        return ApiResponse.<List<RoleResponse>>builder()
                .result(roleService.getAllRoles())
                .build();
    }

    /** Xoá vai trò theo tên. */
    @DeleteMapping("/{role}")
    ApiResponse<Void> deleteRole(@PathVariable String role){
        roleService.deleteRole(role);
        return ApiResponse.<Void>builder().build();
    }
}
