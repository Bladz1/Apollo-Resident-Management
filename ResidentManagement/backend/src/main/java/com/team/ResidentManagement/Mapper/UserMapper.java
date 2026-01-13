package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.UserCreationRequest;
import com.team.ResidentManagement.dto.request.UserUpdateRequest;
import com.team.ResidentManagement.dto.response.UserResponse;
import com.team.ResidentManagement.entity.User;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(UserCreationRequest request);

    UserResponse toUserResponse(User user);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mappings({
            @Mapping(target = "roles", ignore = true),
            @Mapping(target = "fees", ignore = true)
    })
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
