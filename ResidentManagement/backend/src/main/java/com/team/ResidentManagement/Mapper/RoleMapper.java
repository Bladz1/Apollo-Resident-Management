package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.RoleRequest;
import com.team.ResidentManagement.dto.response.RoleResponse;
import com.team.ResidentManagement.entity.Role;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RoleMapper {

    @Mapping(target = "permissions", ignore = true)
    Role toRole(RoleRequest request);

    RoleResponse toRoleResponse(Role role);
}
