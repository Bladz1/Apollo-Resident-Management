package com.team.ResidentManagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.util.Set;

/**
 * DTO response trả về thông tin chi tiết của người dùng.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserResponse {
    String id;
    String username;
    String gender;
    LocalDate birthday;
    String email;
    String personalId;
    String avatarUrl;
    String phoneNumber;
    String address;
    String password;
    String status;
    Set<RoleResponse> roles;
    Set<FeeResponse> fees;
    Set<FeedbackResponse> feedbacks;
}
