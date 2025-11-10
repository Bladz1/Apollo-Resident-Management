package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.UserCreationRequest;
import com.team.ResidentManagement.dto.request.UserUpdateRequest;
import com.team.ResidentManagement.dto.response.UserResponse;
import com.team.ResidentManagement.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mappings;

/**
 * Mapper chuyển đổi dữ liệu liên quan đến User.
 */
@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    @Mappings({
            @Mapping(target = "roles", ignore = true),
            @Mapping(target = "fees", ignore = true)
    })
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
