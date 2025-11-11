package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.RoleMapper;
import com.team.ResidentManagement.dto.request.RoleRequest;
import com.team.ResidentManagement.dto.response.RoleResponse;
import com.team.ResidentManagement.repository.PermissionRepository;
import com.team.ResidentManagement.repository.RoleRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

/**
 * Quản lý vai trò và phân bổ quyền cho từng vai trò.
 */
@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {

    /** Repository vai trò. */
    RoleRepository roleRepository;
    /** Repository quyền để lấy danh sách quyền gán cho vai trò. */
    PermissionRepository permissionRepository;
    /** Mapper chuyển đổi dữ liệu vai trò. */
    RoleMapper roleMapper;

    /**
     * Tạo mới vai trò kèm danh sách quyền.
     */
    public RoleResponse createRole(RoleRequest request){
        var role = roleMapper.toRole(request);

        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    /**
     * Trả về toàn bộ vai trò hiện có.
     */
    public List<RoleResponse> getAllRoles(){
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    /**
     * Xoá vai trò theo tên.
     */
    public void deleteRole(String role){
        roleRepository.deleteById(role);
    }
}
