package com.team.ResidentManagement.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class FeeRequest {
    String id;
    String categoryId;
    String name;
    String agency;
    int amount;
    LocalDate dueDate;
    String status;
    String description;
}
