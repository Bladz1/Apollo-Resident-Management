package com.team.ResidentManagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Entity
public class Fee {
    @Id
    String id;

    String categoryId;
    String name;
    String agency;
    int amount;
    LocalDateTime dueDate;
    String status;
    String description;
}
