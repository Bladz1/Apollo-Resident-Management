package com.team.ResidentManagement.dto.response;


import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

/**
 * DTO response mô tả chi tiết hồ sơ truy nã.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WantedResponse {
    String id;
    String wantedName;
    String alias;
    Set<String> crime;
    String bounty;
    String lastSeen;
    String imageUrl;

}
