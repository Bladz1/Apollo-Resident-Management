package com.team.ResidentManagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * DTO rút gọn cho danh sách đăng ký chờ duyệt của admin.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PendingUserResponse {
    String id;
    String username;
    String personalId;
    String phoneNumber;
    String address;
    String status;
}
