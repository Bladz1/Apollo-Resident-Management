package com.team.ResidentManagement.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

/**
 * DTO request dùng để yêu cầu đăng xuất và vô hiệu hoá token.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class LogoutRequest {
    String token;
}
