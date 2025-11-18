package com.team.ResidentManagement.dto.response;

import com.team.ResidentManagement.entity.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FileUploadResponse {
    boolean success;
    String message;
    String avatarUrl;
    UserResponse user;
}
