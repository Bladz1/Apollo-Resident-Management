package com.team.ResidentManagement.entity;

import com.team.ResidentManagement.enums.FeedbackStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;

@Entity
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "feedback")
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    String id;
    String name;
    String email;
    String phone;
    String address;
    String title;
    String description;

    String attachmentUrl;

    @Enumerated(EnumType.STRING)
    FeedbackStatus status;

    @CreationTimestamp
    LocalDate createdAt;

    @ManyToOne
    @JoinColumn(name = "user_id")
    User user;
}
