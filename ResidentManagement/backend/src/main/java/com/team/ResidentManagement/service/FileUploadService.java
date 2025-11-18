package com.team.ResidentManagement.service;

import com.team.ResidentManagement.Mapper.UserMapper;
import com.team.ResidentManagement.dto.response.FileUploadResponse;
import com.team.ResidentManagement.entity.User;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FileUploadService {
    UserMapper userMapper;
    UserService userService;

    public FileUploadResponse upload(MultipartFile file, String userId) {
        try {
            User updatedUser = userService.updateUserAvatar(userId, file);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Avatar uploaded successfully");
            response.put("avatarUrl", updatedUser.getAvatarUrl());
            response.put("user", updatedUser);

            return FileUploadResponse.builder()
                    .success(true)
                    .message("Avatar uploaded successfully")
                    .avatarUrl(updatedUser.getAvatarUrl())
                    .user(userMapper.toUserResponse(updatedUser))
                    .build();

        } catch (IOException e) {
            return FileUploadResponse.builder()
                    .success(false)
                    .message("Avatar uploaded successfully")
                    .avatarUrl("")
                    .user(userService.getMyInfo())
                    .build();

        } catch (RuntimeException e) {
            return FileUploadResponse.builder()
                    .success(false)
                    .message("RunTimeException " + e.getMessage())
                    .avatarUrl("")
                    .user(userService.getMyInfo())
                    .build();
        }
    }
}
