package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.ProfileRequest;
import com.team.ResidentManagement.dto.request.ProfileUpdateRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.ProfileResponse;
import com.team.ResidentManagement.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller cung cấp API quản lý hồ sơ cư trú của cư dân.
 */
@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {

    /** Dịch vụ nghiệp vụ xử lý hồ sơ cư trú. */
    ProfileService profileService;

    /** Lấy toàn bộ danh sách hồ sơ cư trú. */
    @GetMapping
    public List<ProfileResponse> getProfiles(){
        return profileService.getProfiles();
    }

    /** Cập nhật trạng thái/thông tin hồ sơ (dành cho admin). */
    @PatchMapping
    public ApiResponse<ProfileResponse> updateProfile(@RequestBody ProfileUpdateRequest request){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.updateProfile(request))
                .build();
    }

    /** Tạo mới hồ sơ cư trú cho cư dân. */
    @PostMapping
    public ApiResponse<ProfileResponse> createProfile(@RequestBody ProfileRequest request){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.createProfile(request))
                .build();
    }
}
