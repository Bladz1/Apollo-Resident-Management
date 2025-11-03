package com.team.ResidentManagement.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
    LocalDateTime dueDate;
    String status;
    String description;
}
