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

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleService {

    RoleRepository roleRepository;
    PermissionRepository permissionRepository;
    RoleMapper roleMapper;

    @CacheEvict(value = "roles", allEntries = true)
    public RoleResponse createRole(RoleRequest request){
        var role = roleMapper.toRole(request);

        var permissions = permissionRepository.findAllById(request.getPermissions());
        role.setPermissions(new HashSet<>(permissions));

        role = roleRepository.save(role);
        return roleMapper.toRoleResponse(role);
    }

    @Cacheable(value = "keys", key = "'all'")
    public List<RoleResponse> getAllRoles(){
        return roleRepository.findAll()
                .stream()
                .map(roleMapper::toRoleResponse)
                .toList();
    }

    @CacheEvict(value = "roles", allEntries = true)
    public void deleteRole(String role){
        roleRepository.deleteById(role);
    }
}
