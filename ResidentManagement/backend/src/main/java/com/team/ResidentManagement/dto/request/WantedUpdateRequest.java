package com.team.ResidentManagement.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;
import java.util.UUID;

/**
 * DTO request cập nhật phần thưởng, địa điểm cuối cùng và ảnh truy nã.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WantedUpdateRequest {
    String bounty;
    String lastSeen;
    String imageUrl;
}
