package com.team.ResidentManagement.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "system_news")
public class SystemNews {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;

    String title;

    @Column(length = 500)
    String summary;

    @Column(columnDefinition = "TEXT")
    String content;

    String version;

    @CreationTimestamp
    LocalDateTime createdAt;
}
