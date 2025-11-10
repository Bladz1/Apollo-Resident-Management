package com.team.ResidentManagement.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Set;

/**
 * DTO request thêm/bớt hoặc xoá toàn bộ tội danh trong hồ sơ truy nã.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WantedCrimePatchRequest {

    Set<String> addCrimes;
    Set<String> removeCrimes;
    Boolean clearCrimes;
}
