package com.team.ResidentManagement.dto.request;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

/**
 * DTO request tạo mới hồ sơ truy nã.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WantedRequest {
    String wantedName;
    String alias;
    Set<String> crime;
    String bounty;
    String lastSeen;
    String imageUrl;
}
