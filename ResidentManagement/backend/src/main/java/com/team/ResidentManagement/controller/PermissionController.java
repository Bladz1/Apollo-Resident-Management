package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.request.PermissionRequest;
import com.team.ResidentManagement.dto.response.PermissionResponse;
import com.team.ResidentManagement.service.PermissionService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller quản lý danh sách quyền truy cập.
 */
@RestController
@RequestMapping("/permissions")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PermissionController {

    /** Service xử lý quyền. */
    PermissionService permissionService;

    /** Tạo mới quyền. */
    @PostMapping
    ApiResponse<PermissionResponse> createPermission(@RequestBody PermissionRequest request){
        return ApiResponse.<PermissionResponse>builder()
                .result(permissionService.create(request))
                .build();
    }

    /** Lấy toàn bộ quyền hiện có. */
    @GetMapping
    ApiResponse<List<PermissionResponse>> getAllPermissions(){
        return ApiResponse.<List<PermissionResponse>>builder()
                .result(permissionService.getAll())
                .build();
    }

    /** Xoá quyền theo tên. */
    @DeleteMapping("/{permission}")
    ApiResponse<Void> deletePermission(@PathVariable String permission){
        permissionService.delete(permission);
        return ApiResponse.<Void>builder().build();
    }
}
