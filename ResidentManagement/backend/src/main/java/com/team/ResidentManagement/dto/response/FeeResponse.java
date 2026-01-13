package com.team.ResidentManagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

/**
 * DTO response mô tả chi tiết một khoản phí.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeeResponse {
    String id;
    String feeType;
    String categoryId;
    String name;
    String agency;
    int amount;
    LocalDate dueDate;
    String status;
    String description;
}
