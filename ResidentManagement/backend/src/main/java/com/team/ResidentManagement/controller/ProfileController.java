package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.dto.request.ProfileRequest;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.ProfileResponse;
import com.team.ResidentManagement.service.ProfileService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/profiles")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProfileController {
    ProfileService profileService;

    @GetMapping
    public ApiResponse<List<ProfileResponse>> getProfiles(){
        return ApiResponse.<List<ProfileResponse>>builder()
                .result(profileService.getProfiles())
                .build();
    }

    @PatchMapping
    public ApiResponse<ProfileResponse> updateProfile(@RequestBody ProfileRequest profileRequest){
        return ApiResponse.<ProfileResponse>builder()
                .result(profileService.updateProfile(profileRequest))
                .build();
    }
}
