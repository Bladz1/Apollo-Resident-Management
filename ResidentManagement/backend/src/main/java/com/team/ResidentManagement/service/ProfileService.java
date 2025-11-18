package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.ProfileMapper;
import com.team.ResidentManagement.dto.request.ProfileRequest;
import com.team.ResidentManagement.dto.request.ProfileUpdateRequest;
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
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileService {

    /** Repository thao tác dữ liệu người dùng. */
    UserRepository userRepository;

    /** Repository thao tác dữ liệu hồ sơ cư dân. */
    ProfileRepository profileRepository;

    /** Mapper chuyển đổi giữa entity và DTO hồ sơ. */
    ProfileMapper profileMapper;

    /**
     * Tạo một hồ sơ cư trú mới cho người dùng.
     * <p>
     * Phương thức ánh xạ request sang entity, kiểm tra user tồn tại, thiết lập trạng
     * thái chờ duyệt và khởi tạo lịch sử đầu tiên trước khi lưu vào cơ sở dữ liệu.
     * Nếu hồ sơ đã tồn tại (vi phạm unique key) thì ném {@link AppException} phù hợp.
     * </p>
     */
    public ProfileResponse createProfile(ProfileRequest request){
        Profile profile = profileMapper.toProfile(request);

        User user = userRepository.findById(request.getUserId()).orElseThrow(()
                ->new AppException(ErrorCode.USER_NOT_FOUND));

        String type = ProfileType.fromCode(request.getProfileType());
        
        profile.setStatus(ProfileStatus.PENDING);
        profile.setUser(user);
        profile.setType(type);

        ProfileHistory profileHistory = ProfileHistory.builder()
                .action(ProfileAction.SUBMITTED)
                .profile(profile)
                .description("submitted")
                .build();

        ArrayList<ProfileHistory> profileHistories = new ArrayList<>();
        profileHistories.add(profileHistory);

        profile.setHistory(profileHistories);

        try{
            profileRepository.save(profile);
        } catch (DataIntegrityViolationException exception){
            throw new AppException(ErrorCode.PROFILE_EXISTED);
        }

        return profileMapper.toProfileResponse(profile);
    }

    /**
     * Lấy danh sách toàn bộ hồ sơ cư trú đã lưu.
     * <p>
     * Toàn bộ entity được ánh xạ sang {@link ProfileResponse} để trả về cho client.
     * </p>
     */
    public List<ProfileResponse> getProfiles(){
        return profileRepository.findAll()
                .stream()
                .map(profileMapper::toProfileResponse)
                .toList();
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ProfileResponse updateProfile(ProfileUpdateRequest request){
        Profile profile = profileRepository.findById(request.getProfileId()).orElseThrow(()->new AppException(ErrorCode.PROFILE_NOT_FOUND));

        return profileMapper.toProfileResponse(profileRepository.save(profile));
    }
}
