package com.team.ResidentManagement.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

/**
 * DTO request mô tả thông tin khoản phí cần tạo.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeeRequest {
    String feeType;
    String categoryId;
    String name;
    String agency;
    int amount;
    LocalDate dueDate;
    String status;
    String description;
    String personalId;
}
