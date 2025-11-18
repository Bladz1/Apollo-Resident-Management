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
    /** Ánh xạ request tạo người dùng sang entity User. */
    User toUser(UserCreationRequest request);

    /** Chuyển entity User thành DTO trả về cho client. */
    UserResponse toUserResponse(User user);

    @Mappings({
            @Mapping(target = "roles", ignore = true),
            @Mapping(target = "fees", ignore = true)
    })
    /** Cập nhật các trường cơ bản của User từ request (bỏ qua roles/fees để xử lý thủ công). */
    void updateUser(@MappingTarget User user, UserUpdateRequest request);
}
