package com.team.ResidentManagement.controller;

import com.team.ResidentManagement.Mapper.UserMapper;
import com.team.ResidentManagement.dto.response.ApiResponse;
import com.team.ResidentManagement.dto.response.FileUploadResponse;
import com.team.ResidentManagement.entity.User;
import com.team.ResidentManagement.exception.AppException;
import com.team.ResidentManagement.exception.ErrorCode;
import com.team.ResidentManagement.repository.UserRepository;
import com.team.ResidentManagement.service.FileStorageService;
import com.team.ResidentManagement.service.ProfileImageUploadService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.function.Function;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FileController {

    ProfileImageUploadService profileImageUploadService;
    FileStorageService fileStorageService;
    UserRepository userRepository;
    private final UserMapper userMapper;

    @PostMapping("/upload-avatar")
    public ApiResponse<FileUploadResponse> uploadAvatar (@RequestParam("file") MultipartFile file, @RequestHeader("UserId") String userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        Function<ErrorCode, ApiResponse<FileUploadResponse>> error = errorCode ->
                ApiResponse.<FileUploadResponse>builder()
                        .result(FileUploadResponse.builder()
                                .success(false)
                                .message(errorCode.getMessage())
                                .avatarUrl(null)
                                .user(userMapper.toUserResponse(user))
                                .build())
                        .build();

        if (file.isEmpty()) {
            return error.apply(ErrorCode.FILE_IS_EMPTY);
        }

        if (!isImageFile(file)) {
            return error.apply(ErrorCode.ONLY_FILE_ALLOW);
        }

        return ApiResponse.<FileUploadResponse>builder()
                .result(profileImageUploadService.upload(file, userId))
                .build();
    }

    private boolean isImageFile(MultipartFile file) {
        String contentType = file.getContentType();
        return contentType != null && contentType.startsWith("image/");
    }

    private String determineContentType(String filename) {
        try {
            Path path = Paths.get(filename);
            String mimeType = Files.probeContentType(path);
            return mimeType != null ? mimeType : "application/octet-stream";
        } catch (IOException e) {
            return "application/octet-stream";
        }
    }
}