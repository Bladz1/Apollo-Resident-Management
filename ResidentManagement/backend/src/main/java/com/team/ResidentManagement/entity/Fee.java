package com.team.ResidentManagement.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
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
    @GeneratedValue(strategy = GenerationType.UUID)
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
