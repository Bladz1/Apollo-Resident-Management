package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.ProfileMapper;
import com.team.ResidentManagement.dto.request.ProfileRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.ProfileResponse;
import com.team.ResidentManagement.entity.Profile;
import com.team.ResidentManagement.entity.ProfileHistory;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.enums.ProfileAction;
import com.team.ResidentManagement.enums.ProfileStatus;
import com.team.ResidentManagement.enums.ProfileType;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.ProfileRepository;
import com.team.ResidentManagement.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
public class ProfileService {
    UserRepository userRepository;
    ProfileRepository profileRepository;
    ProfileMapper profileMapper;

    public Profile createProfile(ProfileRequest request){
        User user = userRepository.findById(request.getUserId()).orElseThrow(()->new AppException(ErrorCode.USER_NOT_FOUND));
        ProfileType type = ProfileType.fromCode(request.getProfileType());

        Profile profile = Profile.builder()
                .user(user)
                .type(type)
                .status(ProfileStatus.PENDING)
                .build();

        ProfileHistory profileHistory = ProfileHistory.builder()
                .action(ProfileAction.SUBMITTED)
                .profile(profile)
                .description("submitted")
                .build();
        return profileRepository.save(profile);
    }

    public List<ProfileResponse> getProfiles(){
        return profileRepository.findAll()
                .stream()
                .map(profileMapper::toProfileResponse)
                .toList();
    }

    public ProfileResponse updateProfile(ProfileRequest request){

    }
}
