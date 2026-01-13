package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.PermissionMapper;
import com.team.ResidentManagement.dto.request.PermissionRequest;
import com.team.ResidentManagement.dto.response.PermissionResponse;
import com.team.ResidentManagement.entity.Permission;
import com.team.ResidentManagement.repository.PermissionRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class PermissionService {

    PermissionRepository  permissionRepository;
    PermissionMapper permissionMapper;

    @CacheEvict(value = "permissions", allEntries = true)
    public PermissionResponse create(PermissionRequest request){
        Permission permission = permissionMapper.toPermission(request);

        return permissionMapper.toPermissionResponse(permissionRepository.save(permission));
    }

    @Cacheable(value = "permissions", key = "'all'")
    public List<PermissionResponse> getAll(){
        var permissions = permissionRepository.findAll();
        return permissions.stream().map(permissionMapper::toPermissionResponse).toList();
    }

    @CacheEvict(value = "permissions", allEntries = true)
    public void delete(String permission){
        permissionRepository.deleteById(permission);
    }
}
