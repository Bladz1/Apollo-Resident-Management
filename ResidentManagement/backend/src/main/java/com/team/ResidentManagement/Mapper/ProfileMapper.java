package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.ProfileRequest;

import com.team.ResidentManagement.dto.response.ProfileResponse;
import com.team.ResidentManagement.entity.Profile;
import org.mapstruct.Mapper;

/** Mapper chuyển đổi dữ liệu hồ sơ cư dân giữa entity và DTO. */
@Mapper(componentModel = "spring")
public interface ProfileMapper {
    /** Ánh xạ request tạo hồ sơ thành entity Profile. */
    Profile toProfile(ProfileRequest request);

    /** Chuyển entity Profile thành response gửi cho client. */
    ProfileResponse toProfileResponse(Profile profile);
}
