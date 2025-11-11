package com.team.ResidentManagement.Mapper;

import com.team.ResidentManagement.dto.request.ProfileRequest;

import com.team.ResidentManagement.dto.response.ProfileResponse;
import com.team.ResidentManagement.entity.Profile;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProfileMapper {
    Profile toProfile(ProfileRequest request);

    ProfileResponse toProfileResponse(Profile profile);
}
