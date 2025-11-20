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

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE,  makeFinal = true)
public class FileUploadService {
    UserMapper userMapper;
    UserService userService;

    public FileUploadResponse upload(MultipartFile file, String userId) {
        try {
            User updatedUser = userService.updateUserAvatar(userId, file);

            return FileUploadResponse.builder()
                    .success(true)
                    .message("Avatar uploaded successfully")
                    .avatarUrl(updatedUser.getAvatarUrl())
                    .user(userMapper.toUserResponse(updatedUser))
                    .build();

        } catch (IOException | RuntimeException e) {
            return FileUploadResponse.builder()
                    .success(false)
                    .message(e.getMessage())
                    .avatarUrl("")
                    .user(userService.getMyInfo())
                    .build();
        }
    }
}
