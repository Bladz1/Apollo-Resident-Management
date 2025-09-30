package com.friends.residentalManagement.mapper;

import com.friends.residentalManagement.dto.request.CreateUserRequest;
import com.friends.residentalManagement.dto.response.UserResponse;
import com.friends.residentalManagement.entity.User;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toUser(CreateUserRequest request);
    UserResponse toUserResponse(User user);
}
